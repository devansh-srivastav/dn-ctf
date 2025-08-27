import os
import streamlit as st
from dotenv import load_dotenv

load_dotenv('.env.local')

try:
    from appwrite.client import Client
    from appwrite.services.databases import Databases
    from appwrite.id import ID
    from appwrite.query import Query
except Exception as _e:  # pragma: no cover
    st.error("Missing dependency: appwrite. Run: pip install appwrite streamlit")
    raise


def get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Environment variable {name} is required")
    return value


@st.cache_resource(show_spinner=False)
def get_appwrite() -> tuple[Client, Databases, str, str]:
    endpoint = get_env("APPWRITE_ENDPOINT")
    project_id = get_env("APPWRITE_PROJECT_ID")
    api_key = get_env("APPWRITE_API_KEY")
    database_id = get_env("APPWRITE_DATABASE_ID")
    collection_id = get_env("APPWRITE_COLLECTION_ID")

    client = Client().set_endpoint(endpoint).set_project(project_id).set_key(api_key)
    databases = Databases(client)
    return client, databases, database_id, collection_id


def upsert_score(team_name: str, delta_score: int) -> dict:
    _, databases, database_id, collection_id = get_appwrite()

    # Only allow valid level scores and map to boolean fields
    level_map = {20: "easy", 30: "medium", 50: "hard"}
    if delta_score not in level_map:
        raise ValueError("Score must be one of: 20 (Easy), 30 (Medium), 50 (Hard)")
    level_field = level_map[delta_score]

    # Find existing document by team_name
    res = databases.list_documents(
        database_id,
        collection_id,
        [Query.equal("team_name", team_name), Query.limit(1)],
    )

    if int(res.get("total", 0)) > 0 and len(res.get("documents", [])) > 0:
        doc = res["documents"][0]
        # If level already achieved, do not update score
        if bool(doc.get(level_field, False)):
            return {
                "status": "skipped",
                "reason": f"{level_field.capitalize()} already completed",
                "id": doc.get("$id"),
                "score": int(doc.get("score", 0)),
            }
        current_score = int(doc.get("score", 0))
        new_score = current_score + int(delta_score)
        updated_fields = {"score": new_score, level_field: True}
        updated = databases.update_document(
            database_id,
            collection_id,
            doc["$id"],
            updated_fields,
        )
        return {"status": "updated", "id": updated.get("$id"), "score": new_score}

    # Create new document for team
    created = databases.create_document(
        database_id,
        collection_id,
        ID.unique(),
        {
            "team_name": team_name,
            "score": int(delta_score),
            "easy": level_field == "easy",
            "medium": level_field == "medium",
            "hard": level_field == "hard",
        },
    )
    return {"status": "created", "id": created.get("$id"), "score": int(delta_score)}


def main() -> None:
    st.set_page_config(page_title="CTF Play", page_icon="🎯", layout="centered")

    st.title("🎯 Start Playing")
    st.caption("Submit your team score to the leaderboard.")

    with st.form("score_form", clear_on_submit=False):
        team = st.text_input("Team Name", placeholder="e.g. red-pandas")
        score = st.number_input("Score to add (20 = Easy, 30 = Medium, 50 = Hard)", min_value=0, step=10, value=0)
        submitted = st.form_submit_button("Submit Score", use_container_width=True)

        if submitted:
            if not team.strip():
                st.error("Please enter a team name")
            else:
                try:
                    result = upsert_score(team.strip(), int(score))
                    if result["status"] == "created":
                        st.success(
                            f"Team created with score {result['score']} (id: {result['id']})"
                        )
                    else:
                        st.success(
                            f"Score updated to {result['score']} (id: {result['id']})"
                        )
                except Exception as e:  # noqa: BLE001
                    st.error(f"Failed to submit score: {e}")
                else:
                    if result.get("status") == "skipped":
                        st.info(result.get("reason", "Level already completed"))


if __name__ == "__main__":
    main()


