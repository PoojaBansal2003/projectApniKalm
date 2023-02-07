// document.getElementById('html2').innerHTML = window.innerHeight;
var pages = document.getElementsByClassName('page');
for(var i = 0; i < pages.length; i++)
{
  // for(let j =0 ; j <pages[i].children.length; j++){
  //     pages[i].children[j].style.zIndex = (pages.length + 1 - i);
  //   }
  var page = pages[i];
  if (i % 2 === 0)
    {

      // page.style.zIndex = (pages.length - i);
      page.style.zIndex = (pages.length - i);
    }
}
// let coverPage = document.getElementById("cover");
// console.log
// for(let i=0 ; i < cover.length ; i++)

document.addEventListener('DOMContentLoaded', function(){
for(var i = 0; i < pages.length; i++)
  {
    //Or var page = pages[i];
    pages[i].pageNum = i + 1;
    // console.log(pages[i]);



/* Start Here */
/* This code for not to flip page on click of children element */
/*     
    console.log(pages[i].children.length);
            for(let j=0 ; j < pages[i].children.length ; j++){
              pages[i].children[j].onclick = function(){
                pages[i].style.transform = "none";
              }
              else if (1)
          {
            for(let j=0 ; j < pages[i].children.length ; j++){
              if(pages[i].children[j].onclick()){

              }
              else if(this.pageNum % 2 == 0){
                this.classList.remove('flipped');
                this.previousElementSibling.classList.remove('flipped');

              }
            }
            
          }
              else if(this.pageNum % 2 == 0){
                this.classList.remove('flipped');
                this.previousElementSibling.classList.remove('flipped');

              }
            } */
/* End  hereeeeeee */
    
    pages[i].onclick=function()
    {   
        
            

           if(this.pageNum == pages.length){
            for(let i=0 ;i <pages.length ; i++){
              pages[i].classList.remove("flipped")
            }                
          }
         
       else if (this.pageNum % 2 === 0)
          {
            // console.log(this.pageNum)
            this.classList.remove('flipped');
            this.previousElementSibling.classList.remove('flipped');
            
          }
          // else if (1)
          // {
          //   for(let j=0 ; j < pages[i].children.length ; j++){
          //     if(pages[i].children[j].onclick()){

          //     }
          //     else if(this.pageNum % 2 == 0){
          //       this.classList.remove('flipped');
          //       this.previousElementSibling.classList.remove('flipped');

          //     }
          //   }
            
          // }


        else
          {
            this.classList.add('flipped');
            this.nextElementSibling.classList.add('flipped');
          }
       }
    }
})



/* Hover Effect */

let book = document.getElementById("book");
for(let i=0; i < pages.length;i++){
pages[i].addEventListener("click",slideBook);

function slideBook(){

  if(!pages[0].classList.contains('flipped')){
    // book.classList.add("slide-book");
    book.classList.add('slide-book');
  }
  else if(pages[11].classList.contains('flipped')){
    book.classList.remove("slide-book");
    // location.href(document.getElementById("#cover"));
  }
  
}
}

// pages[11].addEventListener("click", () => {
//     document.getElementById("cover").scrollIntoView(true);
//   })

// console.log(pages[i].classList.contains('flipped'));
// console.log(i);

