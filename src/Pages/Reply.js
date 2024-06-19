import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { authentication, firestore } from '../firebase_config';

export default function Reply(props){

    const [replies, setReplies] = useState([]);
    
    useEffect(() => {
        loadData(props);
     }, [props]); 

    const loadData =  async (props) =>{
        console.log(props);
        if(props.topic.status){
            const col = collection(firestore, "Reply");
            const q = query(col, where("topicId", "==", props.topic.id));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            setReplies(querySnapshot.docs.map(doc=>({id: doc.id, ...doc.data()})));
            console.log(querySnapshot.docs);
            props.topic.status = false;
        }
        
     }

    const handleLike  = async (id, likes) => {
        await updateDoc(doc(firestore, "Reply", id), {
            likes: likes+1
        });
        props.topic.status = true;
        loadData(props);
    };

    const handleDislike  = async(id, dislikes) => {
        await updateDoc(doc(firestore, "Reply", id), {
            dislikes: dislikes+1
        });
        props.topic.status = true;
        loadData(props);
    };

     const handleDeleteReply =  async (id) =>{
        console.log(id);
        const docRef = doc(firestore, "Reply", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let reply = docSnap.data();
            if (reply.userId == authentication.currentUser.uid)
                await deleteDoc(doc(firestore, "Reply", id));
                loadData(props);
        } else {
        
            
        }
     }

    return (
        <div >
            <div class="modal-content" style={{background: "#eeeef5", padding: "10px"}}>
                <div class="modal-header">
                    <div className="footer-newsletter">
                        <h4>{props.topic.topic}</h4>
                        <p>{props.topic.description}</p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div className="container">
                        <div className="row">
                                {replies.length > 0 ? (
                                    replies.map((row, i)=>(
                                        <div className="col-lg-12 topic-reply-list">
                                            <div className="box">
                                                <p>{row.reply}</p>
                                            </div>
                                            <div className="d-flex flex-row mb-3" style={{marginBottom: "0rem"}}>
                                                <div className="p-2">
                                                    <button 
                                                        onClick={() =>handleLike(row.id, row.likes)}
                                                        data-toggle="tooltip" 
                                                        data-placement="top" 
                                                        title="Like this Discussion" 
                                                        className="btn btn-link btn-lg" 
                                                        style={{color: "#5a5af3", textDecoration: "none", padding: "0 10px 0 0"}}>
                                                        <i class="ri-thumb-up-fill" style={{color: "#5a5af3"}}></i>&nbsp;
                                                        {row.likes}
                                                    </button>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                            onClick={() =>handleDislike(row.id, row.dislikes)} 
                                                            className="btn btn-lg btn-link" 
                                                            style={{color: "#5a5af3", textDecoration: "none", padding: "0px"}}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" title="Dislike this Discussion">
                                                            <i class="ri-thumb-down-fill" style={{color: "#5a5af3"}}></i>&nbsp;
                                                        {row.dislikes}    
                                                    </button>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                            onClick={() => handleDeleteReply(row.id)} 
                                                            className="btn btn-lg btn-link" 
                                                            style={{color: "#5a5af3", textDecoration: "none", padding: "0px"}}
                                                            data-toggle="tooltip" 
                                                            data-placement="top" title="Delete Repu">
                                                        <i class="ri-delete-bin-2-line" style={{color: "#5a5af3"}}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-lg-12 topic-reply">
                                        <div className="box">
                                        <h4>No Reply Found</h4>
                                        <p></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link" data-bs-dismiss="modal" style={{textDecoration: "none"}}>Close</button>
                </div>
            </div>
        </div>
    );
}