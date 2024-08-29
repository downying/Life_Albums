import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-black text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
                <Link to="/">
                    <img src="/img/헤더 로고 아이콘_누끼.png" alt="Logo" className="h-12 w-12 mr-4" />
                </Link>
            </div>
            <Link to="/" className="text-lg font-bold text-center flex-grow">
                <h1>LIFE ALBUMS</h1>
            </Link>
            <div>
                <Link to="/login" className="text-white text-sm mr-4">로그인</Link> 
                <Link to="/join" className="text-white text-sm">회원가입</Link> 
            </div>
        </header>
    );
};

export default Header;
