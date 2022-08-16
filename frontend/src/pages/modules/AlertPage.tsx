import './Gamestart.css'

const AlertPage = (props: any) => {

  return (
  <div>
    <div className='ch'>
      <div className='dh3'>
        {props.text}
      </div>
    </div>
  </div>

  );
}

export default AlertPage;