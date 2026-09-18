const properties = [
  {id:1,title:"The Willow Residence",location:"New Town, Kolkata",type:"Villa",price:"₹2.45 Cr",numeric:245,beds:4,baths:4,area:"2,850 sq.ft",purpose:"buy",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",badge:"Featured"},
  {id:2,title:"Azure Heights",location:"Rajarhat, Kolkata",type:"Apartment",price:"₹86 L",numeric:86,beds:3,baths:2,area:"1,620 sq.ft",purpose:"buy",image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=85",badge:"New"},
  {id:3,title:"Palm Grove House",location:"Bidhannagar, Kolkata",type:"House",price:"₹1.72 Cr",numeric:172,beds:4,baths:3,area:"2,400 sq.ft",purpose:"buy",image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",badge:"Verified"},
  {id:4,title:"The Courtyard",location:"Bengaluru, Karnataka",type:"Villa",price:"₹3.15 Cr",numeric:315,beds:5,baths:5,area:"3,900 sq.ft",purpose:"buy",image:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",badge:"Premium"},
  {id:5,title:"Parkside Residences",location:"Durgapur, West Bengal",type:"Apartment",price:"₹48 L",numeric:48,beds:2,baths:2,area:"1,180 sq.ft",purpose:"rent",image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=85",badge:"Value"},
  {id:6,title:"Urban Office Hub",location:"Salt Lake, Kolkata",type:"Commercial",price:"₹1.25 Cr",numeric:125,beds:0,baths:2,area:"1,950 sq.ft",purpose:"commercial",image:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",badge:"Commercial"}
];

const grid=document.getElementById("propertyGrid"), empty=document.getElementById("emptyState");
let activeFilter="all", activePurpose="buy";

function card(p){
  return `<article class="property-card">
    <div class="property-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="badge">${p.badge}</span><button class="heart" data-id="${p.id}" aria-label="Save ${p.title}">♡</button></div>
    <div class="property-info"><h3>${p.title}</h3><div class="location">⌖ ${p.location}</div>
    <div class="specs">${p.beds?`<span>🛏 ${p.beds} Beds</span>`:""}<span>♨ ${p.baths} Baths</span><span>▱ ${p.area}</span></div>
    <div class="price-row"><strong class="price">${p.price}</strong><button class="details-btn" data-details="${p.id}">Details →</button></div></div>
  </article>`;
}
function render(list=properties){
  const filtered=list.filter(p=>(activeFilter==="all"||p.type===activeFilter)&&(activePurpose==="all"||p.purpose===activePurpose||activePurpose==="buy"));
  grid.innerHTML=filtered.map(card).join("");
  empty.style.display=filtered.length?"none":"block";
}
render();

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); activeFilter=btn.dataset.filter; render();
}));

document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activePurpose=btn.dataset.purpose;
  render();
}));

document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  const loc=document.getElementById("location").value.toLowerCase(), type=document.getElementById("type").value, budget=document.getElementById("budget").value;
  let result=properties.filter(p=>{
    const locationOK=!loc||p.location.toLowerCase().includes(loc), typeOK=!type||p.type===type;
    let budgetOK=true;if(budget==="under-50")budgetOK=p.numeric<50;if(budget==="50-100")budgetOK=p.numeric>=50&&p.numeric<=100;if(budget==="100-200")budgetOK=p.numeric>100&&p.numeric<=200;if(budget==="200-plus")budgetOK=p.numeric>200;
    return locationOK&&typeOK&&budgetOK;
  });
  render(result); document.getElementById("properties").scrollIntoView({behavior:"smooth"});
  showToast(`${result.length} ${result.length===1?"property":"properties"} found`);
});

grid.addEventListener("click",e=>{
  const heart=e.target.closest(".heart"); if(heart){heart.classList.toggle("saved");heart.textContent=heart.classList.contains("saved")?"♥":"♡";showToast(heart.classList.contains("saved")?"Property saved":"Property removed");}
  const details=e.target.closest(".details-btn"); if(details){const p=properties.find(x=>x.id==details.dataset.details);openModal(`Property: ${p.title}`);}
});

document.getElementById("viewAll").addEventListener("click",e=>{e.preventDefault();activeFilter="all";activePurpose="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));render();document.getElementById("properties").scrollIntoView({behavior:"smooth"});});

const backdrop=document.getElementById("modalBackdrop"), modalTitle=document.querySelector(".modal h2"), form=document.getElementById("inquiryForm");
function openModal(title="Let's find your place."){modalTitle.innerHTML=title.includes("Property:")?`${title.replace("Property: ","")} <em>details.</em>`:"Let's find your <em>place.</em>";backdrop.classList.add("open");}
function closeModal(){backdrop.classList.remove("open");}
document.querySelectorAll("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal()));
document.getElementById("modalClose").addEventListener("click",closeModal);
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
form.addEventListener("submit",e=>{e.preventDefault();form.style.display="none";document.getElementById("successMessage").style.display="block";setTimeout(()=>{closeModal();form.reset();form.style.display="grid";document.getElementById("successMessage").style.display="none"},2600);showToast("Inquiry submitted successfully");});

const mobile=document.getElementById("mobileToggle"),nav=document.getElementById("navLinks");
mobile.addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
