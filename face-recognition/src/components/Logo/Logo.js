import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import machine from './machine.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max: 25 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                    <img style={{paddingTop: '10px'}} alt='Logo' src={machine} />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;