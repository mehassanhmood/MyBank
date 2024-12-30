import HeaderBox from '@/components/ui/HeaderBox'
import TotalBalanceBox from '@/components/ui/TotalBalanceBox'
import RightSideBar from '@/components/RightSideBar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  console.log(loggedIn)
  return (
    <section
    className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
          type = "greeting"
          title='Welcome'
          user={loggedIn ?.name || "Guest"}
          subtext='Access and manage your account and transactions effeciently.'
          />
          <TotalBalanceBox
          accounts = {[]}
          totalBanks = {1}
          totalCurrentBalance={1250.35}
           />
        </header>
      Recent Trainsations come here
      </div>
      <RightSideBar user={loggedIn} transacations={[]} banks={[{currentBalance: 150.00}, {currentBalance:1000.50}]}/>
    </section>
  )
}

export default Home
