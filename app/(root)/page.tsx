import HeaderBox from '@/components/ui/HeaderBox'
import TotalBalanceBox from '@/components/ui/TotalBalancebox';

const Home = () => {
  const loggedIn = {firstName: "Hassan"}
  return (
    <section
    className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
          type = "greeting"
          title='Welcome'
          user={loggedIn ?.firstName || "Guest"}
          subtext='Access and manage your account and transactions effeciently.'
          />
          <TotalBalanceBox
          accounts = {[]}
          totalBanks = {1}
          totalCurrentBalance={1250.35}
           />
        </header>

      </div>
    </section>
  )
}

export default Home
