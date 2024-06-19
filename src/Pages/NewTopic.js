import { RecaptchaVerifier, browserSessionPersistence, onAuthStateChanged, setPersistence, signInWithPhoneNumber, updateProfile } from "firebase/auth";

import { authentication, firestore } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import "../App.css"
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { v4 } from "uuid";

export default function NewTopic(){

    const confirmationResult = Object();
    const navigate = useNavigate();

    const [isRequestOTP, setIsRequestOTP] = useState(true)
    const [isVerifyOTP, setIsVerifyOTP] = useState(false)
    const [isUserProgile, setIsUserProgile] = useState(false)
    const [status, setStatus] = useState("Please Provide Details to add New Topic")

    useEffect(() => {
        loadData();
     }, []); 

    const  loadData = ()=>{
        
    }
    
   const [topic, setTopic] = useState("")

   const [description, setDescription] = useState("")

   const [topicCategory, setTopicCategory] = useState("")

   const handleTopicChange = (event) => {
        setTopic(event.target.value);
    };

    const handleDescriptionChange  = (event) => {
        setDescription(event.target.value);
    };

    const handleTopicCategoryChange  = (event) => {
        setTopicCategory(event.target.value);
    };

    const handleAddTopic = async() => {
        setStatus("Please Wait");
        let top = remove_stopwords(topic);
        if(topic.length < 10 || description.length < 10){
            setStatus("Please provide valid details");
        }
        else{
            const docRef = await addDoc(collection(firestore, "Topic"), {
                userId: authentication.currentUser.uid,
                usercontact: authentication.currentUser.phoneNumber,
                topicId: v4(),
                topic: topic,
                topicArray: top.toLocaleLowerCase().split(" "),
                likes:0,
                dislikes:0,
                description: description,
                topicCategory: topicCategory,
                isCurrent: true,
                report: false,
                dateAdded: new Date(),
                dateModified: new Date()
              });
              console.log("Document written with ID: ", docRef.id);
              setStatus("Topic Successfully added");
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
                        <h4>Add New Discussion Topic</h4>
                        <p></p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div className="footer-newsletter">
                        <p>{status}</p>
                    </div>
                    <div class="php-email-form" onSubmit="event.preventDefault()">
                        <div class="form-group mt-3">
                            <input type="text" value={topic} class="form-control" name="userName" id="userName" placeholder="Enter Your Topic" onChange={handleTopicChange} required />
                        </div>
                        <div class="form-group mt-3">
                            <textarea class="form-control" value={description} name="message" rows="5" placeholder="Topic Description" onChange={handleDescriptionChange}  required></textarea>
                        </div>
                        <div class="form-group mt-3">
                            <select class="form-control" value={topicCategory} name="message" rows="5" placeholder="Message" onChange={handleTopicCategoryChange} required>
                                <option value="Computer Number">Computer Number</option>
                                <option value="Computer Number">Update Profile</option>
                                <option value="DGCA Examination">DGCA Examination</option>
                                <option value="DTL Licesing">DTL Licesing</option>
                                <option value="Medical">Medical</option>
                            </select>
                        </div>
                        <div class="form-group mt-3 section-title" >
                            <p></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link" data-bs-dismiss="modal" style={{textDecoration: "none"}}>Close</button>
                    <button className="button-login" onClick={handleAddTopic}>Add Details</button>
                </div>
            </div>
        </div>
    );
}