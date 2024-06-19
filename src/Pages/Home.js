import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authentication, firestore } from "../firebase_config";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import {v4} from "uuid";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Reply from "./Reply";
import NewTopic from "./NewTopic";
import TopicReply from "./TopicReply";
export default function Home(){
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [showReply, setShowReply] = useState(false)
    const [topicId, setTopicId] = useState(false)

    const [topicReply, setTopicReply] = useState({id: "", topicId: "", topic: "", description: "", status: false })

    const[searchTopic, setSearchTopic] = useState("");

    useEffect(() => {
        loadData();
     }, []); 

    const loadData = () =>{
        onAuthStateChanged(authentication, (user) => {
            console.log(user);
            if (user!=null) {
                navigate("/")
            } else {
                navigate("/login")
            }
        });
        
    }
    const handleClick = ()=>{
        navigate('/contact')
    }

    const handlePostFirebase = async () =>{
        let topic = "Photo size in are am computer number applications";
        topic = remove_stopwords(topic);
        const docRef = await addDoc(collection(firestore, "Topic"), {
            userid: authentication.currentUser.phoneNumber,
            topicId: v4(),
            topic: topic,
            topicArray: topic.toLocaleLowerCase().split(" "),
            likes:0,
            dislikes:0,
            description: "Topic Description",
            topicCategory: "Computer Number",
            isCurrent: true,
            report: false
          });
          console.log("Document written with ID: ", docRef.id);
    }

    const handleReplyFirebase = async () =>{
        const docRef = await addDoc(collection(firestore, "Reply"), {
            userid: authentication.currentUser.phoneNumber,
            topicId: "0iar9b3nHebRuF1nzGP7",
            topicUiid: "",
            likes: 0,
            dislikes: 0,
            reply: "Hello How are you",
            isCurrent: true,
            report: false
          });
          console.log("Document written with ID: ", docRef.id);
    }

    const handleSearchFirebase = async () =>{
        let search = "Photo";
        let searchWords = remove_stopwords(search).toLocaleLowerCase().split(" ");
        console.log(searchWords)
        const col = collection(firestore, "Topic");

        const q = query(col, where("topicArray", "array-contains-any", searchWords));
        const querySnapshot = await getDocs(q);
        setTableData(querySnapshot.docs.map(doc=>({id: doc.id, ...doc.data()})));
        /*
        console.log(querySnapshot.docs);
        let data = []
        searchWords.forEach(async (item, index) => {
            console.log(item);
            const q = query(col, where("topicArray", "array-contains-any", searchWords));
            const querySnapshot = await getDocs(q);
            data.push();
        })
        
        */
        
    }

    const handleGetReply = async (id) =>{
        setTopicId(id);
        setShowReply(true);
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

    const handleRow = (id) =>{
        console.log(id);
    }

    const handleModelReply = (id, topicId, topic, description) =>{
        setTopicReply({id: id, topicId: topicId, topic: topic, description: description, status : true });
        console.log("Hello How are you");
    }

    const handleModelView = (id, topicId, topic, description) =>{
        setTopicReply({id: id, topicId: topicId, topic: topic, description: description, status: true });
        console.log("Hello How are you");
    }

    const handleAddReply = async (id, topicId) => {
        const docRef = await addDoc(collection(firestore, "Reply"), {
            userid: authentication.currentUser.phoneNumber,
            topicId: id,
            topicUUid: topicId,
            likes: 0,
            dislikes: 0,
            reply: "Hello How are you",
            isCurrent: true,
            report: false
          });
          console.log("Document written with ID: ", docRef.id);
    }

    const handleSearchTopic = async () => {
        console.log(searchTopic)
        let searchWords = remove_stopwords(searchTopic).toLowerCase().split(" ");

        console.log(searchWords)
        
        const col = collection(firestore, "Topic");

        const q = query(col, where("topicArray", "array-contains-any", searchWords));
        const querySnapshot = await getDocs(q);
        setTableData(querySnapshot.docs.map(doc=>({id: doc.id, ...doc.data()})));
        console.log(tableData);
    }

    const handleSearchChange  = (event) => {
        setSearchTopic(event.target.value);
    };

    const handleLike  = async (id, likes) => {
        await updateDoc(doc(firestore, "Topic", id), {
            likes: likes+1
        });
        handleSearchTopic();
    };

    const handleLogout = ()=>{
        signOut(authentication).then(() =>{
            navigate("/login");
        });
    }

    const handleDislike  = async(id, dislikes) => {
        await updateDoc(doc(firestore, "Topic", id), {
            dislikes: dislikes+1
        });
        handleSearchTopic();
    };

    


    return (
        <div>
            <header id="header" className="">
                <div className="container d-flex align-items-center justify-content-between">
                    <h1 className="logo"><a>CoFlyr</a></h1>
                    <nav id="navbar" className="navbar">
                        <a className="getstarted scrollto" onClick={()=>handleLogout()}>Sign Out</a>
                    </nav>
                </div>
            </header>
            <section id="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2 col-md-2">
                                
                            </div>
                            <div class="col-lg-8 col-md-8 footer-newsletter">
                                <div className="search-div" onSubmit="event.preventDefault()">
                                    <input type="email" name="email" value={searchTopic} onChange={handleSearchChange} /><input type="submit" value="Search" onClick={handleSearchTopic} />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2">
                                
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <section id="portfolio" className="portfolio">
                <div class="section-title">
                    <p>Search  for existing discussions or click New DIscussion to start new discussion.</p>
                </div>
                <div className="container">
                    <div class="row">
                        <div class="col-lg-12 d-flex justify-content-center">
                            <ul id="portfolio-flters">
                                <li data-filter="*" data-bs-toggle="modal" data-bs-target="#exampleModal">New Discussion</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="why-us" style={{background: "transparent"}}>
      <div className="container">

        <div className="row">
        {tableData.length > 0 ? (
                    tableData.map((row, i)=>(
          <div className="col-lg-12 topic-reply">
            <div className="box">
              <span>{i+1}</span>
              <h4>{row.topic}</h4>
              <p>{row.description}</p>
            </div>
            <div className="d-flex flex-row mb-3">
                <div className="p-2">
                    <button onClick={() =>handleLike(row.id, row.likes)}
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Like this Discussion" 
                        className="btn btn-link btn-lg" 
                        style={{color: "#5a5af3", textDecoration: "none"}}>
                        <i class="ri-thumb-up-fill" style={{color: "#5a5af3"}}></i>&nbsp;
                        {row.likes}
                    </button>
                </div>
                <div className="p-2">
                    <button onClick={() =>handleDislike(row.id, row.dislikes)} 
                            className="btn btn-lg btn-link" 
                            style={{color: "#5a5af3", textDecoration: "none"}}
                            data-toggle="tooltip" 
                            data-placement="top" title="Dislike this Discussion">
                        <i class="ri-thumb-down-fill" style={{color: "#5a5af3"}}></i>&nbsp;
                        {row.dislikes}    
                    </button>
                </div>
                <div className="p-2">
                    <button onClick={() =>handleModelReply(row.id, row.topicId, row.topic, row.description)} 
                    className="btn btn-lg btn-link" 
                    style={{color: "#5a5af3", textDecoration: "none"}} 
                    data-toggle="tooltip"
                    data-bs-toggle="modal" data-bs-target="#exampleModal1" 
                    data-placement="top" title="Reply to this Discussion">
                        <i class="ri-reply-fill"></i>
                    </button>
                </div>
                <div className="p-2">
                    <button onClick={() =>handleModelView(row.id, row.topicId, row.topic, row.description)}  className="btn btn-lg btn-link" 
                        style={{color: "#5a5af3", textDecoration: "none"}} 
                        data-toggle="tooltip"
                        data-bs-toggle="modal" data-bs-target="#exampleModal2" 
                        data-placement="top" title="View all Replies">
                        <i class="ri-eye-fill"></i>
                    </button>
                </div>
                
            </div>
          </div>)
        )):
        (<div className="col-lg-12 topic-reply">
        <div className="box">
          <h4>No Result Found</h4>
          <p></p>
        </div>
      </div>)
    
        }
        

         

        </div>

      </div>
    </section>
    
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <NewTopic />
        </div>
    </div>
    <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <TopicReply topic = {topicReply} />
        </div>
    </div>
    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <Reply topic = {topicReply} />
        </div>
    </div>
    </div>
    );
}