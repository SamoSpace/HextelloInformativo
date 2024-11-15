"use client";
import React, { useState, useSyncExternalStore } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { MessageIcon } from '@/app/components/IconsManager';
import { PasswordIcon } from '@/app/components/IconsManager';


const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const router = useRouter();


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'hextores', user.uid),{
                email: user.email,
                role: 'admin'
            });

            console.log('User register', user);
            router.push('/')
        }catch (error: any){
            setError(error.message);
        };
    }
    const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const userDoc = await getDoc(doc(db, 'hextores', user.uid));
                const userData = userDoc.data();

                if(userData?.role === 'admin'){
                    router.push('/');
                } else{
                    router.push('/pages/unknowUser');
                }
            }catch (error: any){
                setError(error.message);
            }
        }

    const toggleAuthMode = () => {
            setIsRegister(!isRegister);
        }
    return(
            <>
            <div className='min-h-screen flex items-center justify-center'>
                <div className=' flex justify-center flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff]/30 backdrop-blur-md rounded-2xl shadow-xl text-black'>
                    <div className='flex flex-row justify-center  gap-3 pb-4'>
                        <h2 className='text-3xl font-bold text-[#fff] '>Hextello News</h2>
                    </div>   
                    {/* <h1>{isRegister ? 'Register' : 'Log In'}</h1>*/}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className='text-sm font-light text-[#fff] text-center pb-8'>Logeate para comenzar a escribir</div>
                    <form className="text-black flex flex-col gap-6" onSubmit={isRegister ? handleRegister : handleLogin}>
                        <div className='pb-2'>
                            <label  htmlFor='email'
                                    className='block mb-2 font-medium text-sm text-[var(--subtitles)]'
                            >
                                Email
                            </label>
                            <div className='relative text-gray-400'>
                                <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'>
                                    <MessageIcon/>
                                </span>
                                <input 
                                    type="email" 
                                    className='pl-10 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                                    placeholder='e.g: name@org.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='pb-2'>
                        <label  htmlFor="password"
                                    className='block mb-2 text-sm font-medium text-[var(--subtitles)] flex justify-start'
                            >
                                Password
                            </label>
                            <div className='relative text-gray-400'>
                            <span className='absolute inset-y-0 left-0 flex items-center p-1 pl-3'><PasswordIcon/></span>
                                <input 
                                    type="password" 
                                    className='pl-10 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className='text-white mb-4 rounded-lg hover:bg-white hover:text-black transition duration-1000 p-4 bg-black' 
                                type='submit'
                            >
                            {isRegister ? 'Registrarse' : 'Iniciar Sesion'} 
                            </button>
                    </form>
                    <button className='hover:text-[#fff] transition duration-600' onClick={toggleAuthMode} >
                        {isRegister ? 'Already Have an account? Sign In': 'Do not have an account? Register'}
                    </button>
                </div>
            </div>
            </>
    )
}
export default AuthPage;