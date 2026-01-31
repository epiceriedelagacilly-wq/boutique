function agrandirImage(src) {
    const overlay = document.createElement('div');
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:1000; cursor:pointer;";
    overlay.onclick = () => overlay.remove();

    const img = document.createElement('img');
    img.src = src;
    img.style = "max-width:90%; max-height:90%; border:5px solid white; border-radius:10px;";
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
}