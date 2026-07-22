
const Header = ({ data, changeUser }) => {

  const logoutUser = () => {
    changeUser()
  }

  return (
    <div className='flex items-end justify-between'>
      <h1 className='text-2xl'>
        Hello <br />
        <span className='text-3xl font-semibold'>
          {data?.name || 'Admin'} 🖐
        </span>
      </h1>

      <button
        onClick={logoutUser}
        className='bg-red-600 text-lg font-medium text-white px-5 py-2 rounded-sm hover:bg-red-700'
      >
        Log Out
      </button>
    </div>
  )
}

export default Header