import React from "react";
import { useLocation } from "react-router-dom";
import Chatbot from "../components/Chatbot/Chatbot";
// import Header from '../components/Header/Header';

const Home = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;
  return (
    <div>
      {/* <Header /> */}
      <Chatbot initialMessage={initialMessage} />
    </div>
  );
};

export default Home;
