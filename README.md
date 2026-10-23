Am realizat un proiect frontend despre un catalog de produse ;
In realizarea temei am folsit APi-ul gratuit de la adresa https://dummyjson.com/products ;
Folosesc GET pentru a lua primele 5 produse si POST pentru a adauga produs si trimit datele catre https://dummyjson.com/products/add ;
Nu am avut probleme cu eroarea de CORS pentru ca serverul de la dummyjson lasa orice site sa ii ceara datele (are activat header-ul Access-Control-Allow-Origin: * pe server) ;
Daca aveam propriul meu backend, rezolvam CORS punand fisierele direct in folderul static al serverului
La status 200(ok) inseamna ca serverul a raspuns corect si actualizez lista pe ecran
La status 201 cand adaug un produs in pun primul pe lista fara a da refesh la pagina
La erori 4xx daca trimit date gresite in formular, citesc eroarea primita de la server si o afisez cu rosu sub buron
La erori 5xx  verific cu raspuns.ok daca serverul are vreo problema si afisez un mesaj
Eroare de retea: daca nu am internet deloc apare ca nu s-a putut conecta cu serverul.