import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useUser } from '@auth0/nextjs-auth0/client';
import { use, useEffect } from 'react';


const inter = Inter({ subsets: ['latin'] })

export default function Home({blogs}) {
  const { user, error, isLoading } = useUser();
  
  useEffect(() => {
    const authenticateUser = async () => {
      console.log("user:", user);
      if (user) {
        try {
          const response = await fetch("/api/authenticateUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth0Id: user.sub,
              email: user.email,
              name: user.name,
              nickname: user.nickname,
              picture: user.picture,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Assuming you're using session storage for userId!!!
            sessionStorage.setItem("userId", data.userId);

            const userId = sessionStorage.getItem("userId");
          } else {
            // Handle error scenarios
            console.error("Failed to authenticate user");
          }
        } catch (error) {
          console.error("Error while authenticating user:", error);
        }
      }
    };

    authenticateUser();
  }, [user]);
  return (
    <>
      <Head>
        <title>Social Sync</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <h1 className={styles.title}>Welcome, to your LHL Skeleton!</h1>
      <p className={styles.subtitle}>Please read the the skeleton set up for this should be in the read me one directory above your current.</p>
        <div className={styles.description}> 
          <Image
            src="https://http.cat/100"
            alt="Cat"
            className={styles.vercelLogo}
            width={300}
            height={250}
            priority
          />
        </div>
        <div className={styles.dbContainer}>
          <h3>Values pulled from your DB, these values can be updated or change by typing &rdquo;npx prisma studio&rdquo; in your terminal</h3>
          {blogs && blogs.map(blog => (
            <div key={blog.id}>
              <h4>{blog.title}</h4>
              <p>{blog.content}</p>
            </div>
          ))}
        </div> 
        {!user ? (<a href="/api/auth/login">Login</a>) : (<a href="/api/auth/logout"> Logged in as {user.nickname} | Logout</a>)}
      </main>
    </>
  )
}

export async function getServerSideProps() {
  
  return {
    props: {
      blogs: []
    }
  }
}
