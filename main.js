(function(){
      
let btnAddFolder=document.querySelector("#btnAddFolder");
let btnAddTextFile=document.querySelector("#btnAddTextFile");
let divbreedcrum=document.querySelector("#divbreedcrum");
let divContainer=document.querySelector("#container");
let pageTemplate=document.querySelector("#pagetemplate");
let TextFileTemplate=document.querySelector("#TextFiletemplate");
let divApp=document.querySelector("#app");
let divTitlebar=document.querySelector("#app-titlebar");
let divAppTitle=document.querySelector("#app-title");
let divAppmenubar=document.querySelector("#app-menubar");
let divAppbody=document.querySelector("#app-body");

let aRootPath=document.querySelector(".path");
let resource=[];
let rid=-1;
let cfid=-1;

btnAddFolder.addEventListener("click",addFolder);
btnAddTextFile.addEventListener("click",addTextFile);

aRootPath.addEventListener("click",navigateBreedcrum);


function addFolder(){
    let rname=prompt("Give Folder Name");
    if(!!rname){
    let exists=resource.filter(f => f.pid==cfid).some(f => f.name==rname);
    if(exists==false){
    rid++;
    addFolderHTML(rname,rid,cfid);
    
    resource.push({
      id:rid,
      name:rname,
      rtype:"folder",
      pid:cfid
    });
    savetostorage();
   }else{
    alert("Folder Already Taken,Give some other name");
   }
}else{
    alert("Give Folder Name");
}
}

function deletefolder(){
    let divFolder=this.parentNode;
    let divName=divFolder.querySelector("[purpose='name']");
    
    let fiTBD=parseInt(divFolder.getAttribute("rid"));
    let rname=divName.innerHTML;
    
    let sure=confirm("You Want To Delete the Folder " + rname);
    if(!sure){
        return;
    }

    divContainer.removeChild(divFolder);
    deletefolderHelper(fiTBD);
    savetostorage();


}

function deletefolderHelper(fiTBD){
    let children=resource.filter(f => f.pid==fiTBD);
    for(let i=0;i<children.length;i++){
        deletefolderHelper(children[i].id);
    }

    let ridx=resource.findIndex(f => f.id==fiTBD);
    resource.splice(ridx,1);
}

function renamefolder(){
     let nfname=prompt("Give new Folder Name");

     if(!!nfname){
         let exists=resource.filter(f => f.pid==cfid).some(f => f.name==nfname);
         if(exists==false){
            let divFolder=this.parentNode;
            let divName=divFolder.querySelector("[purpose='name']");
            divName.innerHTML=nfname;
            
            let folder=resource.filter(f=> f.pid==cfid).find(f => f.id==parseInt(divFolder.getAttribute("rid")));
            folder.name=nfname;
            savetostorage();            

         }else{
          alert("Folder already Exists");
         }    
     }else{
         alert("Give Folder Name");
     }
}

function navigateBreedcrum(){
   cfid=this.getAttribute("rid");
    
   divContainer.innerHTML="";
   resource.filter(f => f.pid==cfid).forEach(f =>{
    if(f.rtype=="folder"){ 
        addFolderHTML(f.name,f.id,f.pid);
      }else if(f.rtype=="text-file"){
        addTextFileHTML(f.name,f.id,f.pid);
      }  
  });
  
  while(this.nextSibling){
    this.parentNode.removeChild(this.nextSibling);
}

}

function viewfolder(){
   let divFolder=this.parentNode;
   let divName=divFolder.querySelector("[purpose='name']");
   cfid=parseInt(divFolder.getAttribute("rid"));
   
  let  aPathTemplate=pageTemplate.content.querySelector(".path");
  let  aPath=document.importNode(aPathTemplate,true);
       aPath.innerHTML=divName.innerHTML;
       aPath.setAttribute("rid",cfid);
       divbreedcrum.append(aPath);
       aPath.addEventListener("click",navigateBreedcrum);

       divContainer.innerHTML="";
       resource.filter(f => f.pid==cfid).forEach(f =>{
          if(f.rtype=="folder"){ 
            addFolderHTML(f.name,f.id,f.pid);
          }else if(f.rtype=="text-file"){
            addTextFileHTML(f.name,f.id,f.pid);
          }
  });
}

function addFolderHTML(rname,rid,pid){
    let divFolderTemplate=pageTemplate.content.querySelector(".folder");
    let divFolder=document.importNode(divFolderTemplate,true);


   let divName=divFolder.querySelector("[purpose='name']");
    divName.innerHTML=rname;
    divFolder.setAttribute("rid",rid);
    divFolder.setAttribute("pid",pid);
   let spanDelete=divFolder.querySelector("span[action='delete']");
    spanDelete.addEventListener("click",deletefolder);
              
   let spanEdit=divFolder.querySelector("span[action='edit']");
   spanEdit.addEventListener("click",renamefolder);

   let spanview=divFolder.querySelector("span[action='view']");
   spanview.addEventListener("click", viewfolder);

   divContainer.appendChild(divFolder);
}

function addTextFile(){
    let rname=prompt("Give TextFile Name");
    if(!!rname){
    let exists=resource.filter(f => f.pid==cfid).some(f => f.name==rname);
    if(exists==false){
    rid++;
    addTextFileHTML(rname,rid,cfid);
    
    resource.push({
      id:rid,
      name:rname,
      rtype:"text-file",
      pid:cfid
    });
    savetostorage();
   }else{
    alert("FileName Already Taken,Give some other name");
   }
}else{
    alert("Give File Name");
}
}



function addTextFileHTML(rname,rid,pid){
    let divTextFileTemplate=TextFileTemplate.content.querySelector(".text-file");
    let divTextFile=document.importNode(divTextFileTemplate,true);


   let divName=divTextFile.querySelector("[purpose='name']");
    divName.innerHTML=rname;
    divTextFile.setAttribute("rid",rid);
    divTextFile.setAttribute("pid",pid);
   let spanDelete=divTextFile.querySelector("span[action='delete']");
    spanDelete.addEventListener("click",deletetextfile);
              
   let spanEdit=divTextFile.querySelector("span[action='edit']");
   spanEdit.addEventListener("click",renametextfile);

   let spanview=divTextFile.querySelector("span[action='view']");
   spanview.addEventListener("click", viewtextfile);

   divContainer.appendChild(divTextFile);
}

function deletetextfile(){
    let divTextFile=this.parentNode;
    let divName=divTextFile.querySelector("[purpose='name']");
    
    let fiTBD=parseInt(divTextFile.getAttribute("rid"));
    let rname=divName.innerHTML;
    
    let sure=confirm("You Want To Delete the File " + rname);
    if(!sure){
        return;
    }

    divContainer.removeChild(divTextFile);
    let fileidx=resource.findIndex(f => f.id==parseInt(divTextFile.getAttribute("rid")));
    resource.splice(fileidx,1);   
    savetostorage();

}

function renametextfile(){
    let nfname=prompt("Give new file Name");

    if(!!nfname){
        let exists=resource.filter(f => f.pid==cfid && f.rtype=="text-file").some(f => f.name==nfname);
        if(exists==false){
           let divTextFile=this.parentNode;
           let divName=divTextFile.querySelector("[purpose='name']");
           divName.innerHTML=nfname;
           
           let folder=resource.filter(f=> f.pid==cfid && f.rtype=="text-file").find(f => f.id==parseInt(divTextFile.getAttribute("rid")));
           folder.name=nfname;
           savetostorage();            

        }else{
         alert("filename already Exists");
        }    
    }else{
        alert("Give file Name");
    }
}

function viewtextfile(){
  let divTextFile=this.parentNode;
  let divName=divTextFile.querySelector("[purpose='name']");
  
  divAppTitle.innerHTML="";
  divAppTitle.innerHTML=divName.innerHTML;
  divAppTitle.setAttribute("rid",parseInt(divTextFile.getAttribute("rid")));
  

  let divnotepadMenuTemplate=TextFileTemplate.content.querySelector("[purpose='notepad-menu']");
  let divnotepadmenu=document.importNode(divnotepadMenuTemplate,true);
  divAppmenubar.innerHTML="";
  divAppmenubar.appendChild(divnotepadmenu);

  let divnotepadbodyTemplate=TextFileTemplate.content.querySelector("[purpose='notepad-body']");
  let divnotepadbody=document.importNode(divnotepadbodyTemplate,true);
  divAppbody.innerHTML="";
  divAppbody.appendChild(divnotepadbody);
  
 
 
  let spanSave=divnotepadmenu.querySelector("[action=save]");
  let spanbold=divnotepadmenu.querySelector("[action=bold]");
  let spanitalic=divnotepadmenu.querySelector("[action=italic]");
  let spanunderline=divnotepadmenu.querySelector("[action=underline]");
  let inputbgcolor=divnotepadmenu.querySelector("[action=bg-color]");
  let inputTextcolor=divnotepadmenu.querySelector("[action=fg-color]");
  let selectfontfamily=divnotepadmenu.querySelector("[action=font-family]");
  let selectfontsize=divnotepadmenu.querySelector("[action=font-size]");
  let textArea = divAppbody.querySelector("textArea");

  spanSave.addEventListener("click",SaveNotePad);
  spanbold.addEventListener("click",makeNotePadBold);
  spanitalic.addEventListener("click",makeNotePadItalic);
  spanunderline.addEventListener("click",makeNotePadUnderline);
  inputbgcolor.addEventListener("click",ChangeNotePadBgcolor);
  inputTextcolor.addEventListener("click",ChangeNotePadTextcolor);
  selectfontfamily.addEventListener("click",ChangeNotePadFontFamily);
  selectfontsize.addEventListener("click",ChangeNotePadFontSize);
   
  let fid=parseInt(divAppTitle.getAttribute("rid"));
  let fresource=resource.find(r => r.id==fid);
  spanbold.setAttribute("pressed",!fresource.isBold);
  spanitalic.setAttribute("pressed",!fresource.isItalic);
  spanunderline.setAttribute("pressed",!fresource.isUnderline);
  inputbgcolor.value=fresource.bgcolor;
  inputTextcolor.value=fresource.textcolor;
  selectfontfamily.value=fresource.fontFamily;
  selectfontsize.value=fresource.fontSize;
  textArea.value=fresource.content;

  spanbold.dispatchEvent(new Event("click"));
  spanitalic.dispatchEvent(new Event("click"));
  spanunderline.dispatchEvent(new Event("click"));
  inputbgcolor.dispatchEvent(new Event("change"));
  inputTextcolor.dispatchEvent(new Event("change"));
  selectfontfamily.dispatchEvent(new Event("change"));
  selectfontsize.dispatchEvent(new Event("change"));

  }

function SaveNotePad(){
   let fid=parseInt(divAppTitle.getAttribute("rid"));
   let fresource=resource.find(r => r.id==fid);

  let spanSave=divAppmenubar.querySelector("[action=save]");
  let spanbold=divAppmenubar.querySelector("[action=bold]");
  let spanitalic=divAppmenubar.querySelector("[action=italic]");
  let spanunderline=divAppmenubar.querySelector("[action=underline]");
  let inputbgcolor=divAppmenubar.querySelector("[action=bg-color]");
  let inputTextcolor=divAppmenubar.querySelector("[action=fg-color]");
  let selectfontfamily=divAppmenubar.querySelector("[action=font-family]");
  let selectfontsize=divAppmenubar.querySelector("[action=font-size]");
  let textArea = divAppbody.querySelector("textArea");

   fresource.isBold=spanbold.getAttribute("pressed")=="true";
   fresource.isItalic=spanitalic.getAttribute("pressed")=="true";
   fresource.isUnderline=spanunderline.getAttribute("pressed")=="true";
   fresource.bgcolor=inputbgcolor.value;
   fresource.textcolor=inputTextcolor.value; 
   fresource.fontFamily=selectfontfamily.value;
   fresource.fontSize=selectfontsize.value;
   fresource.content=textArea.value;

   savetostorage();

}

function makeNotePadBold(){
    let textarea=divAppbody.querySelector("textArea");
    let ispressed=this.getAttribute("pressed")=="true";
    if(ispressed==false){
        this.setAttribute("pressed",true);
        textarea.style.fontWeight="bold";
    }else{
        this.setAttribute("pressed",false);
        textarea.style.fontWeight="normal";
    }

}

function makeNotePadItalic(){
    let textarea=divAppbody.querySelector("textArea");
    let ispressed=this.getAttribute("pressed")=="true";
    if(ispressed==false){
        this.setAttribute("pressed",true);
        textarea.style.fontStyle="italic";
    }else{
        this.setAttribute("pressed",false);
        textarea.style.fontStyle="normal";
    }
}

function makeNotePadUnderline(){
    let textarea=divAppbody.querySelector("textArea");
    let ispressed=this.getAttribute("pressed")=="true";
    if(ispressed==false){
        this.setAttribute("pressed",true);
        textarea.style.textDecoration="underline";
    }else{
        this.setAttribute("pressed",false);
        textarea.style.textDecoration="none";
    }
}

function ChangeNotePadBgcolor(){
    
    let color=this.value;
    let textarea=divAppbody.querySelector("textArea");
    textarea.style.backgroundColor=color;
}

function ChangeNotePadTextcolor(){
    
    let color=this.value;
    let textarea=divAppbody.querySelector("textArea");
    textarea.style.color=color;
}

function ChangeNotePadFontFamily(){

    let fontfamily=this.value;
    let textarea=divAppbody.querySelector("textArea");
    textarea.style.fontFamily=fontfamily;
}

function ChangeNotePadFontSize(){
  
    let fontsize=this.value;
    let textarea=divAppbody.querySelector("textArea");
    textarea.style.fontSize=fontsize+"px";
}



function savetostorage(){
   let rjson=JSON.stringify(resource);
   localStorage.setItem("data",rjson);
}

function loadFolderfromStorage(){
   let rjson=localStorage.getItem("data");
   if(!!rjson){

    resource=JSON.parse(rjson);
    resource.forEach(function(f) {
       if(f.id>rid){
           rid=f.id;
       }
     
       if(f.pid==cfid){
           if(f.rtype=="folder"){
           addFolderHTML(f.name,f.id,f.pid);
           }else if(f.rtype=="text-file"){
            addTextFileHTML(f.name,f.id,f.pid);   
           }
       }
  });
   
    }
}
loadFolderfromStorage();
})();