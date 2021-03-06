import React, { useEffect, useState } from 'react';
import './Post.css';
import {db} from './firebase';
import Avatar from "@material-ui/core/Avatar";
import firebase from 'firebase';

function Post({postId,user,username,caption,imageUrl}) {
const [comments,setComments] = useState([]);
const [comment,setComment] = useState('');

    useEffect(() =>{
        let unsubscribe;
        //retrieve from database
        if(postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        };

    },[postId]);

    const postComment = (event) =>{
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            //adding to database
            text: comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');

    }

    return(
        <div className="post">
            <div className="post_header">
                <Avatar 
                className="post_avatar"
                alt={username}
                src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
        {/* header -> avatar + username */}

        {/* image */}
        <img
        className="post_image" 
        src={imageUrl}
        alt="abc"
        />


        {/* username  + caption */}
        
        <h4 className="post_text"><strong>{username}</strong>{caption}</h4>
        
        
        <div className="post_comments">
            {comments.map((comment) => {
                <p>
                    <strong>{comment.username}</strong>{comment.text}
                </p>
            })} 

        </div> 

            {/* to show the add a comment box only when the user is logged in*/}
        {user && (
        <form className="post_commentBox">
            <input
                className="post_input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
            <button 
                disabled={!comment}
                className="post_button"
                type="submit"
                onClick={postComment}
                >Post</button>
        </form>
         )}
        
        
        
        </div>
)
}

export default Post;
// comment.username and comment.text bcoz the comment collection has username and text fields
