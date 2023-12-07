import React, { useEffect } from 'react';
import { questions } from './data.js';
import Question from './Question';
import { MdOutlineLibraryBooks } from 'react-icons/md';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Faq = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  return (
    <section id="faq">
      <div className="container faq">
        <div className="u-title" data-aos="fade-up">
          {/* <MdOutlineLibraryBooks color="#7A66CC" size={30} /> */}
          <h2>FAQs</h2>
        </div>
        <div className="questions">
          {questions.map((question) => (
            <Question key={question.id} title={question.title}>
              <p className="u-text-small">{question.answer}</p>
            </Question>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
