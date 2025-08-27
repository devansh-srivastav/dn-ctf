export const metadata = {
	title: "Contact | CTF Arena",
};

export default function ContactPage() {
	return (
		<main className="min-h-screen px-6 py-12">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-3xl font-bold">Contact</h1>
				<div className="mt-6 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
					<p className="font-semibold">Dr. Lea Schönherr</p>
					<p className="mt-1">
						<a href="mailto:schoenherr@cispa.de" className="hover:underline">schoenherr@cispa.de</a>
					</p>
					<p className="mt-4">CISPA Helmholtz Center for Information Security</p>
					<p>Stuhlsatzenhaus 5</p>
					<p>66123 Saarbrücken</p>
					<p>Germany</p>
				</div>
			</div>
		</main>
	);
}


