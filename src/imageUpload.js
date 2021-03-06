import React,{ useState } from 'react';
import { Button } from '@material-ui/core';
import { storage,db } from './firebase';
import './imageUpload.css';
import firebase from 'firebase';

function ImageUpload({username}) {

    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref('images/${image.name}').put(image);
    

    uploadTask.on(
        "state-changed",
        (snapshot) => {
            //progress function
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) *100
            );
            setProgress(progress);
        },
        (error) => {
            //error function
            console.log(error);
            alert(error.message);
        },
        () => {
            //complete function
            storage 
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({  //adding the posts to the database
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username:username
                    }) //timestamp is imp as it shows the newest posts first
                
                    setProgress(0); //reset back to normal 
                    setCaption('');
                    setImage(null);

                })
        }
    )
    };

    
    return (
        <div className="imageupload">
            {/* i want to have*/}
            {/* caption input*/}
            {/* file picker*/}
            {/* post button*/}
           <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" 
                    placeholder="Enter a caption.."
                    onChange={event => setCaption(event.target.value)}
                    value={caption}/>

            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload