window.addEventListener("DOMContentLoaded", () => {
  //tremos los nodos o etiquetas que utilizaremos del html.
  const inputvalue = document.querySelectorAll(".input"); //en la obtencion de estos inputs traenos todos, ya que tienen la misma clase.
  const containerCard = document.querySelector(".container__cards"); //este contenedor es traido porque aquí es donde pintaremos las cards.
  const btnSave = document.querySelector(".save");
  const btnUpdate = document.querySelector(".btn_update");
  const btnCancel = document.querySelector(".btn_cancel");
  const countUser = document.querySelector(".users"); //este es el span donde mostraremos un conteo de las personas registradas.
  const formulario = document.querySelector(".formulario"); // este solo lo obtuvimos para resetearlo luego de guardar un usuario.
  const search = document.querySelector(".c_search"); //input de busqueda.
  const deleteAll = document.querySelector(".fa-trash");
  const container__registers = document.querySelector(".container__registers"); //obtenido para deshabilitar evento del cursor.
  const container__modal = document.querySelector(".container__modal");
  const modal__message = document.querySelector(".modal__message");
  const container__btns = document.querySelector(".container__btns");
  const close_modal = document.querySelector(".close_modal");

  let newPeople = []; //array creado para crear un usuario.
  let dataLocal; //variable declarada para guardar  en el localStorage cada usuario creado.
  let dataLocalActualizate = JSON.parse(localStorage.getItem("users")) || []; //
  let changeBtn = false;
  getPeopleLocalStorage(dataLocalActualizate); //obtener usuarios del localStorage.
  eventBotons(); //dar evento a los botones de las cards.

  btnSave.addEventListener("click", (e) => {
    container__btns.innerHTML="";
    //este evento en el boton guardar ejecuta dicha funcion y nuevamente le da eventos a los botones.
    e.preventDefault();
    if (validateFields()) {
      container__modal.style.display="flex";
      //si hay campos vacíos manda la alerta.
      modal__message.textContent="Algunos campos están vacíos, llene todos los campos";
      close_modal.addEventListener("click", ()=>{
        container__modal.style.display="none";
      })
    } else {
      //de lo contrario crea un usuario y damos eventos a los botones.
      createPeople();
      eventBotons();
    }
  });

  function saveDataLocalStorage() {
    //guardamos en el localStorage el objeto(users) pero en formato JSON (utilizando el stringify).
    localStorage.setItem("users", JSON.stringify(dataLocal));
  }

  function createPeople() {
    //en esta funcion primero verificamos que el documento ingresado no haya sido ingresado anteriormente.
    const userFind =
      dataLocal.find((u) => inputvalue[3].value === u.document) || "";
    if (userFind !== "") {
      alert("El documento ingresado ya está en el sistema");
    } else {
      const people = {
        //si el documento no está ingresado, procedemos a crear el nuevo usuario; capturando cada valor ingresado en el input correspondiente.
        name: `${inputvalue[0].value.toLowerCase()}`,
        lastName: `${inputvalue[1].value.toLowerCase()}`,
        email: `${inputvalue[2].value.toLowerCase()}`,
        document: `${inputvalue[3].value.toLowerCase()}`,
      };
      if (dataLocal.length > 0) {
        //si hay un usuario en el localStorage ingresamos otro, obtenemos el array del localStorage
        dataLocal.unshift(people);
        localStorage.setItem("users", JSON.stringify(dataLocal));
        getPeopleLocalStorage(dataLocal);
      } else {
        //sino creamos un nuevo usuario en el localStorage y obtenemos la nueva data
        newPeople.unshift(people);
        localStorage.setItem("users", JSON.stringify(newPeople));
        getPeopleLocalStorage(newPeople);
      }
      //cuando ya se ingresan y capturan los valores ingresados, luego de haber guardado el nuevo usuario; borramos los datos del formulario.
      formulario.reset();
    }
  }

  function getPeopleLocalStorage(arrayUsers) {
    containerCard.innerHTML = "";
    dataLocal = JSON.parse(localStorage.getItem("users")) || [];
    for (let i = 0; i < arrayUsers.length; i++) {
      const card = document.createElement("DIV");
      card.setAttribute("class", "card");
      card.innerHTML = `<div class="people">
          <i class="fa-solid fa-user-large"></i>
      </div>
      <div class="information">
          <h3 class="show__info name">${
            arrayUsers[i].name + " " + arrayUsers[i].lastName
          } </h3>
          <h3 class="show__info">${arrayUsers[i].email} </h3>
          <h3 class="show__info">${arrayUsers[i].document} </h3>
          <div class="container__btn">
              <button class="btn btn_edit" id=${
                arrayUsers[i].document
              }>Editar</button>
              <button class="btn btn_delete" id=${
                arrayUsers[i].document
              }>Eliminar</button>
          </div>
      </div>`;
      containerCard.appendChild(card);
    }
    countUser.textContent = dataLocal.length;
    return dataLocal;
  }

  function validateFields() {
    //validando que no hayan campos vacíos
    let emptyFields = 0;
    for (let i = 0; i < inputvalue.length; i++) {
      if (inputvalue[i].value === "") {
        emptyFields++;
        break;
      }
    }
    if (emptyFields > 0) {
      return true;
    } else {
      return false;
    }
  }

  function deletePeople(documentEvent) {
    //convertimos de json a objeto. lo recorremos para verificar si el documento seleccionado es igual y lo eliminamos
    dataLocal = JSON.parse(localStorage.getItem("users"));
    for (let i = 0; i < dataLocal.length; i++) {
      if (dataLocal[i].document === documentEvent) {
        dataLocal.splice(i, 1);
        break;
      }
    }
    saveDataLocalStorage();
    getPeopleLocalStorage(dataLocal);
    eventBotons();
  }
  function createBtnsModal() {
    container__btns.innerHTML = "";
    container__btns.innerHTML = `
    <button class="btn btn_aceptar">Aceptar</button>
    <button class="btn btn_cancelar_modal">Cancelar</button>
    `;
    const btn_cancelar_modal=document.querySelector(".btn_cancelar_modal");
    btn_cancelar_modal.addEventListener("click", ()=>{
      container__modal.style.display="none";
    });
    close_modal.addEventListener("click", ()=>{
      container__modal.style.display="none";
    });
  }

  function editPeople(documentEvent) {
    //quitamos eventos del cursor.
    container__registers.style.pointerEvents = "none";
    const findUser = dataLocal.find((u) => documentEvent === u.document);
    let valuesObject = dataLocal[dataLocal.indexOf(findUser)];
    const indexObjet = dataLocal.indexOf(valuesObject);
    const user = dataLocal[indexObjet];
    const arrayUser = [user.name, user.lastName, user.email, user.document];

    inputvalue.forEach((input, index) => {
      input.value = arrayUser[index];
    });
    inputvalue[3].setAttribute("readOnly", "true");
    changeBtn = true;
    btnSave.classList.add("ocult_btn");
    btnUpdate.classList.remove("ocult_btn");
    btnCancel.classList.remove("ocult_btn");
    btnUpdate.setAttribute("id", indexObjet);
    return indexObjet;
  }
  function eventBotons() {
    //obtenemos todos los botones eliminar y editar de las cards, los recorremos para así darle evento a cada uno.
    const array_btn_edit = [...document.querySelectorAll(".btn_edit")];
    const array_btn_delete = [...document.querySelectorAll(".btn_delete")];
    for (let i = 0; i < array_btn_edit.length; i++) {
      const btn = array_btn_edit[i];
      btn.addEventListener("click", (e) => {
        //currentTarget nos muestra el boton o nodo en cuestión al que se le está dando el evento.
        const id = e.currentTarget.id;
        editPeople(id);
      });
    }
    for (let i = 0; i < array_btn_delete.length; i++) {
      const btn = array_btn_delete[i];
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.id;
        container__modal.style.display="flex";
        createBtnsModal();
        modal__message.textContent="¿Está seguro que desea eliminar este usuario?";
        const btn_aceptar=document.querySelector(".btn_aceptar");
        btn_aceptar.addEventListener("click" , ()=>{
          deletePeople(id);
          container__modal.style.display="none";
        });
      });
    }
  }
  function btn_update_user(indexObjet) {
    if (changeBtn) {
      dataLocal[indexObjet].name = inputvalue[0].value.toLowerCase();
      dataLocal[indexObjet].lastName = inputvalue[1].value.toLowerCase();
      dataLocal[indexObjet].email = inputvalue[2].value.toLowerCase();

      if (validateFields()) {
        alert("Hay campos vacios");
      } else {
        saveDataLocalStorage();
        getPeopleLocalStorage(dataLocal);
        eventBotons();
        formulario.reset();
        btnSave.classList.remove("ocult_btn");
        btnUpdate.classList.add("ocult_btn");
        btnCancel.classList.add("ocult_btn");
        inputvalue[3].removeAttribute("readonly");
        container__registers.style.pointerEvents = "visible";
        changeBtn = false;
        eventBotons();
      }
    }
  }

  btnUpdate.addEventListener("click", (e) => {
    e.preventDefault();
    btn_update_user(parseInt(e.currentTarget.id));
    eventBotons();
  });
  function searchPeople(name_filter) {
    let name_filter_no_spaces = name_filter.replace(/ /g, "");
    const arrayFilter = dataLocal.filter((user) =>
      (user.name + user.lastName)
        .replace(/ /g, "")
        .includes(name_filter_no_spaces)
    );
    if (arrayFilter.length > 0) {
      getPeopleLocalStorage(arrayFilter);
      containerCard.classList.remove("container__show__records__not__font");
    } else {
      containerCard.innerHTML = "No se encontraron registros";
      containerCard.classList.add("container__show__records__not__font");
    }
  }
  search.addEventListener("input", (e) => {
    e.preventDefault();
    searchPeople(search.value.toLocaleLowerCase());
    eventBotons();
  });
  function deleteAllsRecords() {
      localStorage.removeItem("users");
      dataLocal = JSON.parse(localStorage.getItem("users")) || [];
      getPeopleLocalStorage(dataLocal);
  }
  deleteAll.addEventListener("click", ()=>{
    container__modal.style.display="flex";
        createBtnsModal();
        modal__message.textContent="¿Está seguro que desea eliminar todos los registros?";
        const btn_aceptar=document.querySelector(".btn_aceptar");
        btn_aceptar.addEventListener("click" , ()=>{
          deleteAllsRecords();
          container__modal.style.display="none";
        });
  });
});
