import { RecaptchaVerifier, browserSessionPersistence, onAuthStateChanged, setPersistence, signInWithPhoneNumber, updateProfile } from "firebase/auth";

import { authentication, firestore } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import "../App.css"
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { v4 } from "uuid";

export default function TopicReply(props){

    const confirmationResult = Object();
    
    const [status, setStatus] = useState("Please Provide Details to add New Topic")
    
    const [reply, setReply] = useState("")

    const [description, setDescription] = useState("")

   
   const handleTopicChange = (event) => {
        //setTopic(event.target.value);
    };

    const handleDescriptionChange  = (event) => {
        setDescription(event.target.value);
    };

    const handleReplyChange  = (event) => {
        setReply(event.target.value);
    };

    const handleAddReply = async() => {
        setStatus("Please Wait");
        if(reply.length < 10){
            setStatus("Please provide valid details");
        }
        else{
            const docRef = await addDoc(collection(firestore, "Reply"), {
                userId: authentication.currentUser.uid,
                usercontact: authentication.currentUser.phoneNumber,
                topicId: props.topic.id,
                topicUUid: props.topic.topicId,
                likes: 0,
                dislikes: 0,
                reply: reply,
                isCurrent: true,
                report: false,
                dateAdded: new Date(),
                dateModified: new Date()
              });
            setStatus("Reply Successfully Posted");
        }
    }

    const remove_stopwords = (str) => {
        let stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];
        let res = []
        let words = str.split(' ')
        for(let i=0;i<words.length;i++) {
           let word_clean = words[i].split(".").join("")
           if(!stopwords.includes(word_clean)) {
               res.push(word_clean)
           }
        }
        return(res.join(' '))
    }  

    
    return (
        <div>
            <div class="modal-content" style={{background: "#eeeef5", padding: "10px"}}>
                <div class="modal-header">
                    <div className="footer-newsletter">
                        <h4>{props.topic.topic}</h4>
                        <p>{props.topic.description}</p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div className="footer-newsletter">
                        <p>{status}</p>
                    </div>
                    <div class="php-email-form" onSubmit="event.preventDefault()">
                        <div class="form-group mt-3">
                            <textarea class="form-control" value={reply} name="message" rows="5" placeholder="Topic Reply" onChange={handleReplyChange}  required></textarea>
                        </div>
                        
                        <div class="form-group mt-3 section-title" >
                            <p></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link" data-bs-dismiss="modal" style={{textDecoration: "none"}}>Close</button>
                    <button className="button-login" onClick={handleAddReply}>Add Details</button>
                </div>
            </div>
        </div>
    );
}