import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Navbar, Welcome, Footer, Services, Transactions } from '../components/index';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <div className='gradient-bg-welcome'>
        <Navbar />
        <Welcome />
      </div>

      <Services />
      <Transactions />
      <Footer />
       
    </div>
  )
}
