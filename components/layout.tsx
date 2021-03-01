import React from 'react';
import SignInButtons from './auth/sign_in_buttons';
import { getSession } from 'next-auth/client';
import { IRootState } from '../redux/reducers';

import Menu from './menu';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { ELoggedIn } from '../types/ELoggedIn';
import { updateIsLoggedInAC, updateUserAC } from '../redux/actions/appActions';

type TProps = {
    children: React.ReactNode;
    title: string;
};

export default function Layout({ children, title }: TProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state: IRootState) => state.app.currentUser
    );
    const currentEmail = useSelector(
        (state: IRootState) => state.app.currentEmail
    );
    const currentId = useSelector((state: IRootState) => state.app.currentId);
    const isLoggedIn = useSelector((state: IRootState) => state.app.isLoggedIn);
    console.log({ isLoggedIn });

    React.useEffect(() => {
        if (isLoggedIn === ELoggedIn.Unknown) {
            (async () => {
                const session = await getSession();
                console.log({ session });
                if (session) {
                    console.log(
                        'additional info from the server: ',
                        session.someInfo
                    );
                    dispatch(updateIsLoggedInAC(ELoggedIn.True));
                    dispatch(
                        updateUserAC(
                            session.user.name,
                            session.user.email,
                            session.databaseId
                        )
                    );
                } else {
                    console.log('NO session!!!', session);
                    dispatch(updateIsLoggedInAC(ELoggedIn.False));
                    dispatch(updateUserAC(undefined, undefined, undefined));
                }
            })();
        }
    }, []);

    return (
        <div className="container">
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <header>
                <Menu />
            </header>
            {isLoggedIn === ELoggedIn.True && (
                <div>
                    Signed in as {currentUser} with {currentEmail}
                </div>
            )}
            {isLoggedIn !== ELoggedIn.Unknown && (
                <SignInButtons isSignedIn={isLoggedIn === ELoggedIn.True} />
            )}
            <main>
                <h1>{title}</h1>
                <div style={{ flexGrow: 1 }}>{children}</div>
            </main>
            <footer>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <b>The Seed Project</b>
                </a>
            </footer>
            <style jsx>{`
                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                footer {
                    width: 100%;
                    height: 100px;
                    border-top: 1px solid #eaeaea;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                footer a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-decoration: none;
                }

                @media (max-width: 600px) {
                    .grid {
                        width: 100%;
                        flex-direction: column;
                    }
                }
            `}</style>

            <style jsx global>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
                        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
                        Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }
            `}</style>
        </div>
    );
}
