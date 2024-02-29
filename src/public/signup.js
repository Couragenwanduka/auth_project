document.addEventListener('DOMContentLoaded',()=>{
const signupForm= document.getElementById('signupForm');
const messageDiv= document.getElementById('message');
 
signupForm.addEventListener('submit', async(e)=>{
  e.preventDefault();
  const formdate= new FormData(signupForm);
  const date={};
  formdate.forEach((value,key)=>{
    date[key]=value;
  });
  try{
  const response= await fetch("/signup",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(date)
  });
  const responseDate = await response.json();
  if(response.ok){
    messageDiv.textContent=responseDate.message;
  }else{
    messageDiv.textContent=responseDate.message;
  }
}catch(err){
  console.log(err);
  message.textContent="An error occurred. Please try again later.";}})
})