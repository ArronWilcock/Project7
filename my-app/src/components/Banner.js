import '../styles/Banner.css'
import logo from '../assets/icon-left-font.png'

function Banner() {
    const title = 'Jungle House'
    return (
        <div className='gm-banner'>
            <img src={logo} alt='Jungle House' className='gm-logo' />
            <h1 className='jh-title'>{title}</h1>
        </div>
    )
}
 
export default Banner
