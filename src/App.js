import React,{useState,useEffect} from 'react'; 
import './App.css';
import Post from './Post';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './imageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle); 
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged keeps you logged in even if the user that has logged in refreshes the page bcoz onAuthStateChanged works with cookies
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in..
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName){
          //don't update username
        }else{
          //if we just created someone new..
          return authUser.updateProfile({
            displayName: username
          });
        }
      }else {
        //user has logged out..
        setUser(null);
      }
    })

    return () => {
      //perform cleanup actions 
      unsubscribe();  //this is done bcoz each time useEffect fires whnever the user or the username changes than this cleanup process is executed which is efficient programming.
    }

  },[user,username]);

  //useEffect -> runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot) =>{
      //retrevie from database
      //every time a new post is added, this code gets fired
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[]);

  const signUp = (event) => {  //signUp is first time registration
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false); //bcoz we want the modal to close after the signUp process is done
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false) //bcoz we want the modal to close after the sign in is done.
  }


  return (
    <div className="app">
      

      <Modal
      open ={open}
      onClose = {() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
          <center>

          <img
            className="app_headerImage"
            src="https://3rockmarketing.com/wp-content/uploads/2016/09/instagram-logo.png"
            alt="abc"
         />
  
         <Input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />

         <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />

          <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" onClick={signUp}>Sign Up</Button>
          </center>
          </form>
        </div>

      </Modal>

      <Modal
      open ={openSignIn}
      onClose = {() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
          <center>

          <img
            className="app_headerImage"
            src="https://3rockmarketing.com/wp-content/uploads/2016/09/instagram-logo.png"
            alt="abc"
         />

         <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />

          <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" onClick={signIn}>Sign In</Button>
          </center>
          </form>
        </div>

      </Modal>
      <div className="app_header">
        
        <img
        className="app_headerImage"
        src="https://3rockmarketing.com/wp-content/uploads/2016/09/instagram-logo.png"
        alt="abc"
         />

        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
        )}

      </div>

      
      { /*posts*/ }
      <div className="app_posts">
        <div className="app_postsLeft">
        {posts.map(({id,post}) => ( //setting key is imp bcoz without key when something new gets added then the whole page refreshes, but with an id only the change is added and the remaning that are unchanged remains untouched.
          <Post 
            key={id}
            user={user}
            postId = {id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}/>
        ))}
        </div>
        <div className="app_postsRight">
        <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>
      </div>


          
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to Login to upload</h3>
      )}



      

    </div>
  );
}

export default App;
//user?.displayName,,, here ?. is optional chaining 
