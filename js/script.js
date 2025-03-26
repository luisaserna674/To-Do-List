function fechas() {
  let fecha = new Date();
  fecha_actual = fecha.toLocaleDateString("es-ES");
  proxima_fecha = new Date(fecha.getTime() + 86400000).toLocaleDateString(
    "es-ES"
  );
  document.getElementById("fecha_actual").textContent = fecha_actual;
  document.getElementById("fecha_proxima").textContent = proxima_fecha;
}
fechas(); // Llamada inicial

function crearTituloCard() {
  let titulo = document.createElement("input");
  titulo.type = "text";
  titulo.className = "titulo";
  titulo.placeholder = "Escribe el nombre de tu tarea...";
  titulo.style.fontSize = "0.5rem";
  titulo.style.display = "block";
  titulo.maxLength = "25";

  return titulo;
}

function crearDescripcionCard() {
  let contenido = document.createElement("input");
  contenido.type = "text";
  contenido.className = "descripcion";
  contenido.placeholder = "Escribe una corta descripción de la tarea aquí...";
  contenido.style.color = "#abb2b8";
  contenido.style.fontSize = "small";
  // contenido.style.width = "130px";
  contenido.style.fontSize = "0.3rem";
  return contenido;
}

function crearCheckCard() {
  let input_check = document.createElement("input");
  input_check.type = "checkbox";
  input_check.id = "tarea";

  return input_check;
}

function crearBotonElimarCard() {
  let boton_eliminar = document.createElement("button");
  boton_eliminar.type = "button";
  boton_eliminar.onclick = eliminarTarea;
  // Crear la imagen
  let img_eliminar = document.createElement("img");
  img_eliminar.src = "./assets/images/trash.png";
  img_eliminar.alt = "trash";
  img_eliminar.style.width = "20px";

  boton_eliminar.appendChild(img_eliminar);

  return boton_eliminar;
}

function crearBotonEditarCard() {
  let boton_modificar = document.createElement("button");
  boton_modificar.type = "button";
  boton_modificar.onclick = guardarTarea;
  boton_modificar.style.display = "none"
  boton_modificar.className = "edit_buton";
  // Crear la imagen
  const img_modificar = document.createElement("img");
  img_modificar.src = "./assets/images/pencil.png";
  img_modificar.alt = "pencil";
  img_modificar.style.width = "20px";

  boton_modificar.appendChild(img_modificar);

  return boton_modificar;
}

function crearBotonGuardarCard() {
  let boton_guardar = document.createElement("button");
  boton_guardar.type = "button";
  boton_guardar.onclick = guardarTarea;
  boton_guardar.className = "save_buton";
  // Crear la imagen
  const img_guardar = document.createElement("img");
  img_guardar.src = "./assets/images/check.png";
  img_guardar.alt = "save";
  img_guardar.style.width = "20px";

  boton_guardar.appendChild(img_guardar);

  return boton_guardar;
}

function crearCard(dia) {
  card_class_name =
    dia == 1 ? "card_tarea_hoy active" : "card_tarea_manana active";

  // Crear la card
  let div_card = document.createElement("div");
  div_card.className = card_class_name;

  // Div check
  let div_check = document.createElement("div");
  div_check.className = "check";

  let input = crearCheckCard();
  div_check.appendChild(input);

  div_card.appendChild(div_check);

  // Div títulos
  let div_title = document.createElement("div");
  div_title.className = "card_content";

  let titulo = crearTituloCard();
  div_title.appendChild(titulo);

  let contenido = crearDescripcionCard();
  div_title.appendChild(contenido);

  div_card.appendChild(div_title);

  // Div Botones
  let div_botones = document.createElement("div");
  div_botones.className = "buttons";

  let boton_eliminar = crearBotonElimarCard();
  let boton_modificar = crearBotonEditarCard();
  let boton_guardar = crearBotonGuardarCard();

  div_botones.appendChild(boton_eliminar);
  div_botones.appendChild(boton_modificar);
  div_botones.appendChild(boton_guardar);

  div_card.appendChild(div_botones);

  // Insertar la card en el contenedor
  return div_card;
}

function crearTarea(dia) {
  //Validamos que no exista otra card con la clase .active
  if (document.getElementsByClassName("active").length > 0) {
    //Mostramos alerta pare evitar crear más tareas
    iziToast.show({
      position: "topCenter",
      color: "blue",
      title: "Cuidado!",
      message: "Debes guardar las tareas creadas antes de generar una nueva",
    });

    // Resaltamos el boton de guardar
    const save_buton = document.getElementsByClassName("save_buton")[0];
    save_buton.style.backgroundColor = "#9edfff";
    save_buton.className = "save_buton_alert";

    // Despuès de 5 seg eliminamos la animaciòn del boton guardar
    setTimeout(() => {
      save_buton.style.backgroundColor = "#eceef3";
      save_buton.className = "save_buton";
    }, 5000);
  } else {
    class_name = dia == 1 ? "card_container_hoy" : "card_container_manana";
    const container = document.getElementById(class_name);

    let card = crearCard(dia);
    container.appendChild(card);
  }
}

function eliminarTareas(dia) {
  class_name = dia == 1 ? "card_tarea_hoy" : "card_tarea_manana";
  const container = document.getElementsByClassName(class_name);

  let mensaje = dia == 1 ? "hoy" : "mañana";
  Swal.fire({
    title: "Estás seguro?",
    text: "Deseas eliminar todas las tareas del día de " + mensaje + ".",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      // debugger;
      Array.from(container).forEach((element) => {
        element.remove();
      });
    }
  });
}

function eliminarTarea() {
  this.parentElement.parentElement.remove();
}

function guardarTarea() {
  let tipo = this.className.includes("save_buton") ? 1 : 2;

  // Bloqueamos los campos de texto
  let tarea = this.parentElement.parentElement;
  let contenidos = tarea.getElementsByClassName("card_content")[0];

  contenidos.childNodes.forEach((element) => {
    tipo === 1 ? (element.readOnly = true) : (element.readOnly = false);
  });

  if(tipo === 1) {
    // Eliminamos su clase active si se va a guardar
    tarea.className = tarea.className.replace("active", "");
    //agregamos el boton de modificar
    debugger
    let modificar = this.parentElement.getElementsByClassName("edit_buton")[0]
    modificar.style.display = "block"
    
    console.log(contenidos);
  }
  else{
    debugger
    //Si se va modificar, activamos el botón de guardar
    let guardar = this.parentElement.getElementsByClassName("save_buton")[0]
    guardar.style.display = "block"
    guardar.className = "save_buton active"

  }

  this.style.display = "none";
}
