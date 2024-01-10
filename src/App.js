import logo from "./logo.svg";
import "./App.css";
import Prompt from "./Prompt";

import {createMessages, FeedbackType} from "./promptContent";

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import OpenAI from "openai";

import TextareaAutosize from "react-textarea-autosize";
import {ThreeDots} from "react-loader-spinner";

const ex_q = `Technology has significantly altered the way we communicate in modern society. While there are positive aspects to these changes, there are also negative ones. Discuss the impact of technology on communication and share your perspective.`
const ex_a = `My opinion of trchnology is a strongly positive aspect. By technology, people who live in modern can communicate regardless of time and region. Before the technology developed , people should face someone who they want to communicate. So, if you don't know where he is, you can't talk to him. Additonlly, if he is sleeping, you should wait until he wake up. But after the technology developed, most of people use cell phones and email service. By using texts, emails or something else, we can touch others regardless of when it is, and where you are. I think the development of technology change our life style. Of course, there is negatice aspect which people have a lot of stress because of getting bussines texts even it is weekend. But I think after the culture which thinks others' stress is made, it isn't problem. My opinion of trchnology thus is a strongly positive aspect.`

function App() {
  const [offTopicFeedback, setOffTopicFeedback] = useState("");
  const [varietyFeedback, setVarietyFeedback] = useState("");
  const [elaborationFeedback, setElaboartionFeedback] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const onFeedbackButtonPressed = () => {
    getFeedbackFromGPT();
  };

  const openai = useRef(
    new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  );

  const getFeedbackFromGPT = async () => {
    const model = "gpt-3.5-turbo";

    if (question.trim() == "" || answer.trim() == "") return;
    if (isLoading) return;

    setIsLoading(true);
    const offTopicCompletion = await openai.current.chat.completions.create({
      messages: createMessages(question, answer, FeedbackType.OFF_TOPIC),
      model: model,
      max_tokens: 180,
      temperature: 0.3,
    });

    const varietyCompletion = await openai.current.chat.completions.create({
      messages: createMessages(
        question,
        answer,
        FeedbackType.STRUCTURE_VARIETY
      ),
      model: model,
      max_tokens: 180,
    });

    const elaborationCompletion = await openai.current.chat.completions.create({
      messages: createMessages(question, answer, FeedbackType.ELABORATION),
      model: model,
      max_tokens: 180,
    });

    const offTopicComment = offTopicCompletion.choices[0].message.content;
    const varietyComment = varietyCompletion.choices[0].message.content;
    const elaborationComment = elaborationCompletion.choices[0].message.content;

    console.log(elaborationComment);
    setIsLoaded(true);
    setOffTopicFeedback(offTopicComment);
    setVarietyFeedback(varietyComment);
    setElaboartionFeedback(elaborationComment);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(process.env.REACT_APP_OPENAI_API_KEY);
    // checkOffTopicWithGPT()
  }, []);

  return (
    <div className="App">
      <div className="title-container">
        <h1 className="title">CorrecTOEFL</h1>
      </div>

      <div className="content-container">
        <div className="input-panel">
          <div className="prompt-container">
            <label className="prompt-label">Question</label>
            <textarea
              className="prompt-textarea"
              rows={10}
              onChange={handleQuestionChange}
              minRows={10}
              placeholder="문제를 입력하세요"
              value={question}
            />
          </div>
          <div className="prompt-container">
            <label className="prompt-label">Your Answer</label>
            <TextareaAutosize
              className="prompt-textarea"
              rows={10}
              onChange={handleAnswerChange}
              minRows={10}
              placeholder="답안을 입력하세요"
              value={answer}
            />
            <span className="answer-count">
              {answer.length} characters, {answer.split(/\s+/).length} words
            </span>
          </div>
          <div className="button-section">
            <button className="sample-test-button" onClick={() => {
              setQuestion(ex_q)
              setAnswer(ex_a)
            }}>샘플 테스트해보기</button>
            <button
              className="submit-button"
              style={{
                backgroundColor: "#089E9D",
                border: "none",
                color: "white",
                fontSize: 20,
                padding: 16,
                borderRadius: 12,
                fontWeight: "normal",
                fontFamily: "Fira Code",
              }}
              type="submit"
              onClick={onFeedbackButtonPressed}
            >
              {isLoading ? (
                <ThreeDots
                  visible={true}
                  height="60"
                  width="30"
                  color="white"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                "Get Feedback ->"
              )}
            </button>
          </div>
        </div>

        <div className="output-panel">
          {isLoaded && <h2>Off-Topic</h2>}
          {/* <h2>Off-Topic</h2> */}
          <p>{offTopicFeedback}</p>
          {isLoaded && <h2>Structure Variety</h2>}
          {/* <h2>Structure Variety</h2> */}
          <p>{varietyFeedback}</p>
          {isLoaded && <h2>Elaboration</h2>}
          {/* <h2>Elaboration</h2> */}
          <p>{elaborationFeedback}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
