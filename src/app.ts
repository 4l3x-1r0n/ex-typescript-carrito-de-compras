const cart_div = document.querySelector("#carrito") as HTMLDivElement;
const cartContent_tbody = document.querySelector("#lista-carrito tbody") as HTMLTableElement;
const resetCartBtn_a = document.querySelector("#vaciar-carrito") as HTMLAnchorElement;
const coursesList_div = document.querySelector("#lista-cursos") as HTMLDivElement;
const cartCount_p = document.querySelector("#carrito-count") as HTMLParagraphElement;


interface Course {
    img: string;
    title: string;
    price: string;
    id: string;
    count: number;
}

const globalCourseList: Course[] = [];


EventListenersInit();
function EventListenersInit(): void {
    // Delegacion para detectar que se dio clic en algun elemento dentro de la lista de cursos
    coursesList_div.addEventListener("click", addCourse);
    resetCartBtn_a.addEventListener("click", resetCart);
    cart_div.addEventListener("click", deleteCourse);
}

function addCourse(e: Event): void {
    e.preventDefault();

    const element = e.target as HTMLElement;

    if (element.classList.contains("agregar-carrito")) {
        const course: Course = readCourseData(element.parentElement?.parentElement as HTMLElement);
        addToCourseList(course, globalCourseList);
        putInCart(globalCourseList);
    }
}

function readCourseData(card: HTMLElement): Course {
    const imagen = card.querySelector(".imagen-curso") as HTMLImageElement;
    const titulo = card.querySelector("h4") as HTMLHeadingElement;
    const precio = card.querySelector(".precio span") as HTMLSpanElement;
    const id = card.querySelector("a") as HTMLAnchorElement;

    const curso: Course = {
        img: imagen.src ?? "",
        title: titulo.textContent ?? "",
        price: precio.textContent ?? "",
        id: id.getAttribute("data-id") ?? "",
        count: 1,
    };
    return curso;
}

function getCourseIndexByCourseID(id: string, courseList: Course[]): number {
    let index = -1;
    courseList.some((courseInList, i) => {
        if (courseInList.id === id) {
            index = i;
            return true;
        }
    });
    return index;
}

function addToCourseList(course: Course, courseList: Course[]) {

    const courseIndex = getCourseIndexByCourseID(course.id, courseList);

    if (courseIndex !== -1) {
        courseList[courseIndex].count++;
        return;
    }

    courseList.push(course);
}

function resetHtmlCart(): void {
    // metodo lento para eliminar elementos
    // contenedorCarrito.innerHTML = "";

    while (cartContent_tbody.firstChild) {
        // contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        cartContent_tbody.firstChild.remove();
    }
}

function putInCart(courseList: Course[]): void {
    resetHtmlCart();

    courseList.forEach((course: Course) => {

        const { img, price, title, id, count } = course;

        const row = document.createElement("tr");
        row.innerHTML = `
        <td><img src="${img}" alt="imagen" width="100"></td>
        <td>${title}</td>
        <td>${price}</td>
        <td>${count}</td>
        <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
        `;
        cartContent_tbody.append(row);
    });

    cartCount(courseList);
}

function cartCount(courseList: Course[]): void {
    if (courseList.length) {
        const count = courseList.reduce((prev, course) => prev += course.count, 0);
        cartCount_p.textContent = count.toString();
        cartCount_p.classList.remove("hide");
        return;
    }
    cartCount_p.classList.add("hide");
}

function resetCart(): void {
    globalCourseList.length = 0;
    resetHtmlCart();
    cartCount(globalCourseList);
}

function deleteCourse(e: Event): void {
    e.preventDefault();
    const element = e.target as HTMLAnchorElement;
    if (element.classList.contains("borrar-curso")) {
        const courseId = element.getAttribute("data-id");
        removeCourseFromListById(courseId ?? "", globalCourseList);
        putInCart(globalCourseList);
    }
}

function removeCourseFromListById(id: string, courseList: Course[]): void {

    const courseIndex = getCourseIndexByCourseID(id, courseList);

    if (courseList[courseIndex].count > 1) {
        courseList[courseIndex].count -= 1;
        return;
    }

    courseList.splice(courseIndex, 1);
}
