import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center ">
    <h1>Social Sync</h1>
    <Link href="/settings"> Settings </Link>
    </main>
  )
}