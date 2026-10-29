const UI = {
    room: (data) => /*html*/`
        <div class="content" id="room-card-${data.id}" data-type="${data.type}">
           ${renderContentByType(data)}
        </div>
    `,
    editor: () => /*html*/`
        <form class="creation-bar" id="editor-form">
            <select class="type-select" id="editor-type">
                <option>Text</option>
                <option>Photo</option>
                <option>Video</option>
            </select>
            <input type="text" placeholder="" class="content-input" id="editor-input">
            <button type="submit" id="editor-submit">Send</button>
        </form>
    `
};

function renderContentByType(data) {
    const currentType = data.type ? data.type.toLowerCase() : 'text';

    switch (currentType) {
        case 'photo':
            return /*html*/ `<img src="${data.src || ''}" alt="Photo" class="room-img" id="room-img-${data.id}">`;
        case 'video':
            return /*html*/ `<video src="${data.src || ''}" controls class="room-video" id="room-video-${data.id}"></video>`;
        case 'text':
        default:
            return /*html*/ `<p class="room-text" id="room-text-${data.id}">${data.text || ''}</p>`;
    }
}

let resizeHandler = null;

export async function roomModule() {
    const roomMain = document.getElementById('sp-main');
    const roomAside = document.getElementById('sp-aside');
    if (!roomMain || !roomAside) return;

    if (!document.getElementById('active-room-style')) {
        const link = document.createElement('link');
        link.id = 'active-room-style';
        link.rel = 'stylesheet';
        link.href = '/grp-fd/room.css';
        document.head.appendChild(link);
    }

    roomMain.innerHTML = /*html*/`<div id="sp-room" class="room-sp"></div>`;
    const roomSpatial = document.getElementById('sp-room');
    if (!roomSpatial) return;

    const handResponsive = () => {
        const isMobile = window.innerWidth <= 770;
        const xForm = document.getElementById('editor-form');

        if (isMobile) {
            if (!roomAside.contains(xForm)) {
                if (xForm) xForm.remove();
                roomAside.insertAdjacentHTML('beforeend', UI.editor());
                formListener(roomSpatial);
            }
        } else {
            if (!roomSpatial.contains(xForm)) {
                if (xForm) xForm.remove();
                roomSpatial.insertAdjacentHTML('afterbegin', UI.editor());
                formListener(roomSpatial);
            }
        }
    };

    handResponsive();

    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = handResponsive;
    window.addEventListener('resize', resizeHandler);

    await loadInitialData(roomSpatial);
}

function formListener(tGrig) {
    const form = document.getElementById('editor-form');
    if (!form) return;

    form.replaceWith(form.cloneNode(true));
    const activeFrom = document.getElementById('editor-form');

    activeFrom.addEventListener('submit', async (e) => {
        e.preventDefault();

        const typeSelect = document.getElementById('editor-type');
        const contentInput = document.getElementById('editor-input');
        const submitButton = document.getElementById('editor-submit');

        const checkValue = typeSelect.value.toLowerCase();

        const payload = {
            type: typeSelect.value,
            text: checkValue === 'text' ? contentInput.value : '',
            src: checkValue !== 'text' ? contentInput.value : '',
        };

        try {
            submitButton.disabled = true;

            const response = await fetch('/api/room/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to create content');

            const savedRoomFormDB = await response.json();

            contentInput.value = '';
            tGrig.insertAdjacentHTML('beforeend', UI.room(savedRoomFormDB));
        } catch (error) {
            console.error('Error backend:', error);
            alert('No saved data in backend');
        } finally {
            submitButton.disabled = false;
        }
    });
}

async function loadInitialData(tGrid) {
    try {
        const response = await fetch('/api/room');

        if (!response.ok) throw new Error('No found data from backend');

        const roomsFormDB = await response.json();

        roomsFormDB.forEach(room => {
            tGrid.insertAdjacentHTML('beforeend', UI.room(room));
        });
    } catch (error) {
        console.error('error loading room:', error);
        tGrid.innerHTML = /*html*/ `<div class="error">Error contact with data base</div>`;
    }
}