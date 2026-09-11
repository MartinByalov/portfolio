/* =========================================================
   GEOMETRY BOARD
   ========================================================= */

/* =========================================================
   CONSTANTS
   ========================================================= */

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 800;

const SNAP_DISTANCE = 14;

const SVG_NS = "http://www.w3.org/2000/svg";


/* =========================================================
   ELEMENTS
   ========================================================= */

const board = document.getElementById("board");
const svg = document.getElementById("geometrySvg");
const objectsLayer = document.getElementById("geometryObjects");
const boardEmpty = document.getElementById("boardEmpty");
const snapIndicator = document.getElementById("snapIndicator");
const currentToolText = document.getElementById("currentToolText");
const cursorPosition = document.getElementById("cursorPosition");
const objectCount = document.getElementById("objectCount");
const gridBackground = document.getElementById("gridBackground");
const axisX = document.getElementById("axisX");
const axisY = document.getElementById("axisY");
const gridButton = document.getElementById("gridButton");
const labelsButton = document.getElementById("labelsButton");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");


/* =========================================================
   STATE
   ========================================================= */

let currentTool = "select";

let objects = [];

let selectedObjectId = null;

let temporaryPoints = [];

let polygonPoints = [];

let pencilPoints = [];

let isDrawing = false;

let isMoving = false;

let moveStart = null;

let movingObjectId = null;

let isDrawingShape = false;

let shapeDragStart = null;

let showGrid = true;

let showLabels = true;

let labelCounter = 0;

let undoStack = [];

let redoStack = [];


/* =========================================================
   TOOL NAMES
   ========================================================= */

const toolNames = {
    select: "Избери",
    point: "Точка",
    segment: "Отсечка",
    line: "Права",
    ray: "Лъч",
    circle: "Окръжност",
    arc: "Дъга",
    polygon: "Многоъгълник",
    pencil: "Молив",
    eraser: "Гума"
};


/* =========================================================
   SVG HELPERS
   ========================================================= */

function createSvgElement(type) {
    return document.createElementNS(SVG_NS, type);
}


/* =========================================================
   POINTER POSITION
   ========================================================= */

function getSvgPoint(event) {
    const rect = svg.getBoundingClientRect();
    const scaleX = SVG_WIDTH / rect.width;
    const scaleY = SVG_HEIGHT / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}


/* =========================================================
   DISTANCE
   ========================================================= */

function distance(a, b) {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2)
    );
}


/* =========================================================
   SNAP TO EXISTING POINT
   ========================================================= */

function snapPoint(point) {
    let closest = null;
    let closestDistance = SNAP_DISTANCE;

    objects.forEach(object => {
        if (object.type !== "point") {
            return;
        }

        const d = distance(point, object);
        if (d <= closestDistance) {
            closestDistance = d;
            closest = {
                x: object.x,
                y: object.y,
                id: object.id
            };
        }
    });

    if (closest) {
        snapIndicator.setAttribute("cx", closest.x);
        snapIndicator.setAttribute("cy", closest.y);
        snapIndicator.setAttribute("opacity", "1");
        return closest;
    }

    snapIndicator.setAttribute("opacity", "0");
    return point;
}


/* =========================================================
   UPDATE CURSOR & LIVE PREVIEWS
   ========================================================= */

svg.addEventListener("pointermove", event => {
    const point = getSvgPoint(event);

    cursorPosition.textContent = `x: ${Math.round(point.x)} · y: ${Math.round(point.y)}`;

    if (currentTool !== "select" && currentTool !== "eraser") {
        snapPoint(point);
    }

    /* DRAGGING SHAPE PREVIEW (Live drag-to-draw or click-move preview) */
    const activeStart = (isDrawingShape && shapeDragStart) || (temporaryPoints.length > 0 ? temporaryPoints[0] : null);
    if (activeStart && (currentTool === "segment" || currentTool === "line" || currentTool === "ray" || currentTool === "circle")) {
        const snappedCurrent = snapPoint(point);
        if (currentTool === "circle") {
            renderPreviewCircle(activeStart, snappedCurrent);
        } else {
            renderPreviewLine(activeStart, snappedCurrent, currentTool);
        }
    } else if (temporaryPoints.length > 0 && currentTool === "arc") {
        const snappedCurrent = snapPoint(point);
        renderPreviewLine(temporaryPoints[temporaryPoints.length - 1], snappedCurrent, "segment");
    }

    /* POLYGON LIVE PREVIEW LINE */
    if (polygonPoints.length > 0 && currentTool === "polygon") {
        const snappedCurrent = snapPoint(point);
        renderPreviewLine(polygonPoints[polygonPoints.length - 1], snappedCurrent, "segment");
    }

    /* ERASER DRAG WIPING */
    if (currentTool === "eraser" && event.buttons === 1) {
        const target = findObjectAtPoint(point);
        if (target) {
            deleteObject(target.id);
        }
    }
});


/* =========================================================
   HIDE SNAP
   ========================================================= */

svg.addEventListener("pointerleave", () => {
    snapIndicator.setAttribute("opacity", "0");
});


/* =========================================================
   TOOL SELECTION
   ========================================================= */

const toolButtons = document.querySelectorAll(".tool-button[data-tool]");

toolButtons.forEach(button => {
    button.addEventListener("click", () => {
        setTool(button.dataset.tool);
    });
});

function setTool(tool) {
    currentTool = tool;
    temporaryPoints = [];
    polygonPoints = [];
    pencilPoints = [];
    isDrawing = false;
    isMoving = false;
    isDrawingShape = false;
    shapeDragStart = null;
    movingObjectId = null;
    selectedObjectId = null;
    removePreview();

    toolButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.tool === tool);
    });

    currentToolText.textContent = toolNames[tool] || tool;

    board.classList.toggle("select-mode", tool === "select");
    board.classList.toggle("eraser-mode", tool === "eraser");

    render();
}


/* =========================================================
   CREATE POINT
   ========================================================= */

function createPoint(point) {
    saveState();

    const object = {
        id: createId(),
        type: "point",
        x: point.x,
        y: point.y,
        label: nextLabel()
    };

    objects.push(object);
    render();
    return object;
}


/* =========================================================
   CREATE LINE OBJECT
   ========================================================= */

function createTwoPointObject(type, first, second) {
    saveState();

    objects.push({
        id: createId(),
        type,
        x1: first.x,
        y1: first.y,
        x2: second.x,
        y2: second.y
    });

    render();
}


/* =========================================================
   CREATE CIRCLE
   ========================================================= */

function createCircle(center, edge) {
    saveState();

    objects.push({
        id: createId(),
        type: "circle",
        cx: center.x,
        cy: center.y,
        r: distance(center, edge)
    });

    render();
}


/* =========================================================
   CREATE ARC
   ========================================================= */

function createArc(center, start, end) {
    const radius = distance(center, start);
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(end.y - center.y, end.x - center.x);

    let delta = endAngle - startAngle;
    if (delta < 0) {
        delta += Math.PI * 2;
    }

    saveState();

    objects.push({
        id: createId(),
        type: "arc",
        cx: center.x,
        cy: center.y,
        r: radius,
        startAngle,
        endAngle: startAngle + delta
    });

    render();
}


/* =========================================================
   CREATE POLYGON
   ========================================================= */

function createPolygon(points) {
    if (points.length < 3) {
        return;
    }

    saveState();

    objects.push({
        id: createId(),
        type: "polygon",
        points: points.map(point => ({
            x: point.x,
            y: point.y
        }))
    });

    render();
}


/* =========================================================
   CREATE PENCIL
   ========================================================= */

function createPencil(points) {
    if (points.length < 2) {
        return;
    }

    saveState();

    objects.push({
        id: createId(),
        type: "pencil",
        points: points.map(point => ({
            x: point.x,
            y: point.y
        }))
    });

    render();
}


/* =========================================================
   POINTER DOWN (ЧЕРТАЕНЕ С ВЛАЧЕНЕ ИЛИ КЛИКВАНЕ)
   ========================================================= */

svg.addEventListener("pointerdown", event => {
    const rawPoint = getSvgPoint(event);
    const point = (currentTool === "select" || currentTool === "eraser")
        ? rawPoint
        : snapPoint(rawPoint);

    /* -----------------------------------------------
       SELECT
       ----------------------------------------------- */
    if (currentTool === "select") {
        const target = findObjectAtPoint(point);
        if (target) {
            selectedObjectId = target.id;
            isMoving = true;
            movingObjectId = target.id;
            moveStart = { x: point.x, y: point.y };
            render();
        } else {
            selectedObjectId = null;
            render();
        }
        return;
    }

    /* -----------------------------------------------
       ERASER
       ----------------------------------------------- */
    if (currentTool === "eraser") {
        const target = findObjectAtPoint(point);
        if (target) {
            deleteObject(target.id);
        }
        return;
    }

    /* -----------------------------------------------
       POINT
       ----------------------------------------------- */
    if (currentTool === "point") {
        createPoint(point);
        return;
    }

    /* -----------------------------------------------
       SEGMENT / LINE / RAY / CIRCLE (ВЛАЧЕНЕ ИЛИ КЛИКВАНЕ)
       ----------------------------------------------- */
    if (
        currentTool === "segment" ||
        currentTool === "line" ||
        currentTool === "ray" ||
        currentTool === "circle"
    ) {
        if (temporaryPoints.length === 0) {
            // Започваме чертане с влачене (drag-to-draw)
            isDrawingShape = true;
            shapeDragStart = point;
            createPreviewPoint(point);
        } else {
            // Второ кликване в режим последователно кликване
            const first = temporaryPoints[0];
            temporaryPoints = [];
            removePreview();
            if (currentTool === "circle") {
                createCircle(first, point);
            } else {
                createTwoPointObject(currentTool, first, point);
            }
        }
        return;
    }

    /* -----------------------------------------------
       ARC
       ----------------------------------------------- */
    if (currentTool === "arc") {
        temporaryPoints.push(point);
        createPreviewPoint(point);

        if (temporaryPoints.length === 3) {
            removePreview();
            createArc(
                temporaryPoints[0],
                temporaryPoints[1],
                temporaryPoints[2]
            );
            temporaryPoints = [];
        }
        return;
    }

    /* -----------------------------------------------
       POLYGON
       ----------------------------------------------- */
    if (currentTool === "polygon") {
        polygonPoints.push(point);
        renderPreviewPolygon();

        if (
            polygonPoints.length >= 3 &&
            distance(point, polygonPoints[0]) < SNAP_DISTANCE
        ) {
            polygonPoints.pop();
            removePreview();
            createPolygon(polygonPoints);
            polygonPoints = [];
            render();
        }
        return;
    }

    /* -----------------------------------------------
       PENCIL
       ----------------------------------------------- */
    if (currentTool === "pencil") {
        isDrawing = true;
        pencilPoints = [point];
        return;
    }
});


/* =========================================================
   POINTER MOVE (ДВИЖЕНИЕ И ПРЕВЮ)
   ========================================================= */

svg.addEventListener("pointermove", event => {
    const point = getSvgPoint(event);

    /* -----------------------------------------------
       MOVING OBJECT
       ----------------------------------------------- */
    if (isMoving && movingObjectId) {
        const object = objects.find(item => item.id === movingObjectId);
        if (!object) return;

        const dx = point.x - moveStart.x;
        const dy = point.y - moveStart.y;

        moveObject(object, dx, dy);
        moveStart = { x: point.x, y: point.y };
        render();
        return;
    }

    /* -----------------------------------------------
       PENCIL
       ----------------------------------------------- */
    if (currentTool === "pencil" && isDrawing) {
        pencilPoints.push(point);
        renderPencilPreview();
    }
});


/* =========================================================
   POINTER UP (ЗАВЪРШВАНЕ НА ЧЕРТАЕНЕ С ВЛАЧЕНЕ)
   ========================================================= */

svg.addEventListener("pointerup", event => {
    const rawPoint = getSvgPoint(event);
    const point = snapPoint(rawPoint);

    if (isMoving) {
        saveState();
        isMoving = false;
        movingObjectId = null;
        moveStart = null;
        render();
    }

    /* ЗАВЪРШВАНЕ НА ЧЕРТАЕНЕ С ВЛАЧЕНЕ (SEGMENT, LINE, RAY, CIRCLE) */
    if (isDrawingShape && shapeDragStart) {
        isDrawingShape = false;
        const dist = distance(shapeDragStart, point);

        if (dist > 8) {
            // Влаченето е завършено — създаваме фигурата веднага!
            removePreview();
            temporaryPoints = [];

            if (currentTool === "circle") {
                createCircle(shapeDragStart, point);
            } else {
                createTwoPointObject(currentTool, shapeDragStart, point);
            }
            shapeDragStart = null;
            render();
            return;
        } else {
            // Беше единичен клик — оставяме начална точка за втория клик
            temporaryPoints = [shapeDragStart];
            shapeDragStart = null;
            createPreviewPoint(temporaryPoints[0]);
            render();
            return;
        }
    }

    /* ЗАВЪРШВАНЕ НА PENCIL */
    if (currentTool === "pencil" && isDrawing) {
        isDrawing = false;
        if (pencilPoints.length > 1) {
            createPencil(pencilPoints);
        }
        pencilPoints = [];
        removePreview();
        render();
    }
});


/* =========================================================
   POINTER CANCEL
   ========================================================= */

svg.addEventListener("pointercancel", () => {
    isMoving = false;
    movingObjectId = null;
    moveStart = null;
    isDrawing = false;
    isDrawingShape = false;
    shapeDragStart = null;
    pencilPoints = [];
    temporaryPoints = [];
    removePreview();
    render();
});


/* =========================================================
   MOVE OBJECT
   ========================================================= */

function moveObject(object, dx, dy) {
    if (object.type === "point") {
        object.x += dx;
        object.y += dy;
        return;
    }

    if (
        object.type === "segment" ||
        object.type === "line" ||
        object.type === "ray"
    ) {
        object.x1 += dx;
        object.y1 += dy;
        object.x2 += dx;
        object.y2 += dy;
        return;
    }

    if (
        object.type === "circle" ||
        object.type === "arc"
    ) {
        object.cx += dx;
        object.cy += dy;
        return;
    }

    if (
        object.type === "polygon" ||
        object.type === "pencil"
    ) {
        object.points.forEach(p => {
            p.x += dx;
            p.y += dy;
        });
    }
}


/* =========================================================
   FIND OBJECT
   ========================================================= */

function findObjectAtPoint(point) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const object = objects[i];
        if (isPointNearObject(point, object)) {
            return object;
        }
    }
    return null;
}


/* =========================================================
   OBJECT HIT TEST
   ========================================================= */

function isPointNearObject(point, object) {
    const threshold = 12;

    if (object.type === "point") {
        return distance(point, object) <= threshold;
    }

    if (object.type === "segment") {
        return distanceToSegment(point, object) <= threshold;
    }

    if (object.type === "line") {
        return distanceToInfiniteLine(point, object) <= threshold;
    }

    if (object.type === "ray") {
        return distanceToRay(point, object) <= threshold;
    }

    if (object.type === "circle") {
        const d = distance(point, { x: object.cx, y: object.cy });
        return Math.abs(d - object.r) <= threshold;
    }

    if (object.type === "arc") {
        const d = distance(point, { x: object.cx, y: object.cy });
        if (Math.abs(d - object.r) > threshold) {
            return false;
        }
        const angle = Math.atan2(point.y - object.cy, point.x - object.cx);
        return angleBetween(angle, object.startAngle, object.endAngle);
    }

    if (object.type === "polygon") {
        for (let i = 0; i < object.points.length; i++) {
            const a = object.points[i];
            const b = object.points[(i + 1) % object.points.length];
            if (distanceToSegmentPoints(point, a, b) <= threshold) {
                return true;
            }
        }
    }

    if (object.type === "pencil") {
        for (let i = 0; i < object.points.length - 1; i++) {
            if (distanceToSegmentPoints(point, object.points[i], object.points[i + 1]) <= threshold) {
                return true;
            }
        }
    }

    return false;
}


/* =========================================================
   DISTANCE TO SEGMENT
   ========================================================= */

function distanceToSegment(point, object) {
    return distanceToSegmentPoints(
        point,
        { x: object.x1, y: object.y1 },
        { x: object.x2, y: object.y2 }
    );
}

function distanceToSegmentPoints(point, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    if (dx === 0 && dy === 0) {
        return distance(point, a);
    }

    const t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy);
    const clamped = Math.max(0, Math.min(1, t));

    const closest = {
        x: a.x + clamped * dx,
        y: a.y + clamped * dy
    };

    return distance(point, closest);
}


/* =========================================================
   DISTANCE TO INFINITE LINE
   ========================================================= */

function distanceToInfiniteLine(point, object) {
    const x1 = object.x1;
    const y1 = object.y1;
    const x2 = object.x2;
    const y2 = object.y2;

    const numerator = Math.abs(
        (y2 - y1) * point.x -
        (x2 - x1) * point.y +
        x2 * y1 -
        y2 * x1
    );

    const denominator = Math.sqrt(
        Math.pow(y2 - y1, 2) +
        Math.pow(x2 - x1, 2)
    );

    if (denominator === 0) {
        return Infinity;
    }

    return numerator / denominator;
}


/* =========================================================
   DISTANCE TO RAY
   ========================================================= */

function distanceToRay(point, object) {
    const dx = object.x2 - object.x1;
    const dy = object.y2 - object.y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
        return Infinity;
    }

    const projection = ((point.x - object.x1) * dx + (point.y - object.y1) * dy) / (length * length);

    if (projection < 0) {
        return distance(point, { x: object.x1, y: object.y1 });
    }

    return distanceToInfiniteLine(point, object);
}


/* =========================================================
   ANGLE CHECK
   ========================================================= */

function normalizeAngle(angle) {
    const twoPi = Math.PI * 2;
    while (angle < 0) angle += twoPi;
    while (angle >= twoPi) angle -= twoPi;
    return angle;
}

function angleBetween(angle, start, end) {
    angle = normalizeAngle(angle);
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    if (end < start) end += Math.PI * 2;
    if (angle < start) angle += Math.PI * 2;

    return angle >= start && angle <= end;
}


/* =========================================================
   DELETE OBJECT
   ========================================================= */

function deleteObject(id) {
    const index = objects.findIndex(object => object.id === id);
    if (index === -1) return;

    saveState();
    objects.splice(index, 1);

    if (selectedObjectId === id) {
        selectedObjectId = null;
    }

    render();
}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener("keydown", event => {
    if (event.key === "Delete" && selectedObjectId) {
        deleteObject(selectedObjectId);
    }

    if (event.key === "Escape") {
        isDrawingShape = false;
        shapeDragStart = null;
        temporaryPoints = [];
        polygonPoints = [];
        pencilPoints = [];
        removePreview();
        render();
    }
});


/* =========================================================
   RENDER
   ========================================================= */

function render() {
    objectsLayer.innerHTML = "";

    objects.forEach(object => {
        renderObject(object);
    });

    updateLabels();
    updateStatus();
    updateEmptyState();
}


/* =========================================================
   RENDER OBJECT
   ========================================================= */

function renderObject(object) {
    let element = null;

    if (object.type === "point") {
        element = createSvgElement("circle");
        element.setAttribute("cx", object.x);
        element.setAttribute("cy", object.y);
        element.setAttribute("r", "6");
        element.classList.add("geometry-object", "geometry-point");
    }

    if (object.type === "segment") {
        element = createSvgElement("line");
        element.setAttribute("x1", object.x1);
        element.setAttribute("y1", object.y1);
        element.setAttribute("x2", object.x2);
        element.setAttribute("y2", object.y2);
        element.classList.add("geometry-object", "geometry-line");
    }

    if (object.type === "line") {
        const extended = extendLine(object, 2000);
        element = createSvgElement("line");
        element.setAttribute("x1", extended.x1);
        element.setAttribute("y1", extended.y1);
        element.setAttribute("x2", extended.x2);
        element.setAttribute("y2", extended.y2);
        element.classList.add("geometry-object", "geometry-line");
    }

    if (object.type === "ray") {
        const ray = extendRay(object);
        element = createSvgElement("line");
        element.setAttribute("x1", object.x1);
        element.setAttribute("y1", object.y1);
        element.setAttribute("x2", ray.x2);
        element.setAttribute("y2", ray.y2);
        element.classList.add("geometry-object", "geometry-line");
    }

    if (object.type === "circle") {
        element = createSvgElement("circle");
        element.setAttribute("cx", object.cx);
        element.setAttribute("cy", object.cy);
        element.setAttribute("r", object.r);
        element.classList.add("geometry-object", "geometry-circle");
    }

    if (object.type === "arc") {
        const start = {
            x: object.cx + object.r * Math.cos(object.startAngle),
            y: object.cy + object.r * Math.sin(object.startAngle)
        };
        const end = {
            x: object.cx + object.r * Math.cos(object.endAngle),
            y: object.cy + object.r * Math.sin(object.endAngle)
        };
        const largeArc = (object.endAngle - object.startAngle) > Math.PI ? 1 : 0;

        const path = createSvgElement("path");
        path.setAttribute("d", `
            M ${start.x} ${start.y}
            A ${object.r} ${object.r} 0 ${largeArc} 1 ${end.x} ${end.y}
        `);
        element = path;
        element.classList.add("geometry-object", "geometry-line");
    }

    if (object.type === "polygon") {
        element = createSvgElement("polygon");
        element.setAttribute("points", object.points.map(p => `${p.x},${p.y}`).join(" "));
        element.classList.add("geometry-object", "geometry-polygon");
    }

    if (object.type === "pencil") {
        element = createSvgElement("polyline");
        element.setAttribute("points", object.points.map(p => `${p.x},${p.y}`).join(" "));
        element.classList.add("geometry-object", "geometry-pencil");
    }

    if (!element) return;

    element.dataset.id = object.id;

    if (selectedObjectId === object.id) {
        element.classList.add("selected");
    }

    element.addEventListener("pointerdown", event => {
        event.stopPropagation();

        if (currentTool === "select") {
            selectedObjectId = object.id;
            isMoving = true;
            movingObjectId = object.id;
            const point = getSvgPoint(event);
            moveStart = point;
            render();
        }

        if (currentTool === "eraser") {
            deleteObject(object.id);
        }
    });

    objectsLayer.appendChild(element);
}


/* =========================================================
   EXTEND LINE & RAY
   ========================================================= */

function extendLine(object, length) {
    const dx = object.x2 - object.x1;
    const dy = object.y2 - object.y1;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) {
        return {
            x1: object.x1,
            y1: object.y1,
            x2: object.x2,
            y2: object.y2
        };
    }

    const ux = dx / len;
    const uy = dy / len;

    return {
        x1: object.x1 - ux * length,
        y1: object.y1 - uy * length,
        x2: object.x2 + ux * length,
        y2: object.y2 + uy * length
    };
}

function extendRay(object) {
    const dx = object.x2 - object.x1;
    const dy = object.y2 - object.y1;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) {
        return {
            x2: object.x2,
            y2: object.y2
        };
    }

    const ux = dx / len;
    const uy = dy / len;
    const length = 3000;

    return {
        x2: object.x1 + ux * length,
        y2: object.y1 + uy * length
    };
}


/* =========================================================
   LABELS
   ========================================================= */

function updateLabels() {
    const labels = document.querySelectorAll(".geometry-label");
    labels.forEach(label => label.remove());

    if (!showLabels) return;

    objects
        .filter(object => object.type === "point")
        .forEach(point => {
            const text = createSvgElement("text");
            text.setAttribute("x", point.x + 12);
            text.setAttribute("y", point.y - 12);
            text.textContent = point.label;
            text.classList.add("geometry-label");
            objectsLayer.appendChild(text);
        });
}

function nextLabel() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let index = labelCounter++;

    if (index < letters.length) {
        return letters[index];
    }

    return (
        letters[Math.floor(index / letters.length) - 1] +
        letters[index % letters.length]
    );
}


/* =========================================================
   ID GENERATOR
   ========================================================= */

function createId() {
    return (
        "object-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 8)
    );
}


/* =========================================================
   STATUS
   ========================================================= */

function updateStatus() {
    const count = objects.length;
    objectCount.textContent = count === 1 ? "1 обект" : `${count} обекта`;
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function updateEmptyState() {
    if (boardEmpty) {
        boardEmpty.classList.toggle("hidden", objects.length > 0);
    }
}


/* =========================================================
   GRID TOGGLE
   ========================================================= */

gridButton.addEventListener("click", () => {
    showGrid = !showGrid;
    gridBackground.style.display = showGrid ? "" : "none";
    axisX.style.display = showGrid ? "" : "none";
    axisY.style.display = showGrid ? "" : "none";
    gridButton.classList.toggle("active", showGrid);
});


/* =========================================================
   LABELS TOGGLE
   ========================================================= */

labelsButton.addEventListener("click", () => {
    showLabels = !showLabels;
    labelsButton.classList.toggle("active", showLabels);
    render();
});


/* =========================================================
   UNDO / REDO
   ========================================================= */

function cloneObjects(source) {
    return JSON.parse(JSON.stringify(source));
}

function saveState() {
    undoStack.push(cloneObjects(objects));
    if (undoStack.length > 50) {
        undoStack.shift();
    }
    redoStack = [];
}

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

function undo() {
    if (undoStack.length === 0) return;

    redoStack.push(cloneObjects(objects));
    objects = undoStack.pop();
    selectedObjectId = null;
    render();
}

function redo() {
    if (redoStack.length === 0) return;

    undoStack.push(cloneObjects(objects));
    objects = redoStack.pop();
    selectedObjectId = null;
    render();
}


/* =========================================================
   CLEAR
   ========================================================= */

clearButton.addEventListener("click", () => {
    if (objects.length === 0) return;

    const confirmed = confirm("Да изчистя ли цялата дъска?");
    if (!confirmed) return;

    saveState();
    objects = [];
    selectedObjectId = null;
    temporaryPoints = [];
    polygonPoints = [];
    pencilPoints = [];
    isDrawingShape = false;
    shapeDragStart = null;
    labelCounter = 0;
    removePreview();
    render();
});


/* =========================================================
   PREVIEWS (LINE, CIRCLE, POINT, POLYGON, PENCIL)
   ========================================================= */

function createPreviewPoint(point) {
    let circle = document.getElementById("previewPoint");
    if (!circle) {
        circle = createSvgElement("circle");
        circle.id = "previewPoint";
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#f17a3e");
        circle.setAttribute("opacity", "0.8");
        circle.classList.add("geometry-preview");
        objectsLayer.appendChild(circle);
    }
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
}

function renderPreviewLine(first, current, type) {
    let previewLine = document.getElementById("previewLine");
    if (!previewLine) {
        previewLine = createSvgElement("line");
        previewLine.id = "previewLine";
        previewLine.classList.add("geometry-preview");
        objectsLayer.appendChild(previewLine);
    }

    if (type === "line") {
        const ext = extendLine({ x1: first.x, y1: first.y, x2: current.x, y2: current.y }, 2000);
        previewLine.setAttribute("x1", ext.x1);
        previewLine.setAttribute("y1", ext.y1);
        previewLine.setAttribute("x2", ext.x2);
        previewLine.setAttribute("y2", ext.y2);
    } else if (type === "ray") {
        const ray = extendRay({ x1: first.x, y1: first.y, x2: current.x, y2: current.y });
        previewLine.setAttribute("x1", first.x);
        previewLine.setAttribute("y1", first.y);
        previewLine.setAttribute("x2", ray.x2);
        previewLine.setAttribute("y2", ray.y2);
    } else {
        previewLine.setAttribute("x1", first.x);
        previewLine.setAttribute("y1", first.y);
        previewLine.setAttribute("x2", current.x);
        previewLine.setAttribute("y2", current.y);
    }
}

function renderPreviewCircle(center, edge) {
    let previewCircle = document.getElementById("previewCircle");
    if (!previewCircle) {
        previewCircle = createSvgElement("circle");
        previewCircle.id = "previewCircle";
        previewCircle.classList.add("geometry-preview");
        objectsLayer.appendChild(previewCircle);
    }
    const r = distance(center, edge);
    previewCircle.setAttribute("cx", center.x);
    previewCircle.setAttribute("cy", center.y);
    previewCircle.setAttribute("r", r);
}

function renderPreviewPolygon() {
    const old = document.getElementById("previewPolygon");
    if (old) old.remove();

    if (polygonPoints.length < 2) return;

    const polygon = createSvgElement("polyline");
    polygon.id = "previewPolygon";
    polygon.setAttribute("points", polygonPoints.map(p => `${p.x},${p.y}`).join(" "));
    polygon.classList.add("geometry-preview");
    objectsLayer.appendChild(polygon);
}

function renderPencilPreview() {
    const old = document.getElementById("previewPencil");
    if (old) old.remove();

    if (pencilPoints.length < 2) return;

    const pencil = createSvgElement("polyline");
    pencil.id = "previewPencil";
    pencil.setAttribute("points", pencilPoints.map(p => `${p.x},${p.y}`).join(" "));
    pencil.classList.add("geometry-preview");
    objectsLayer.appendChild(pencil);
}

function removePreview() {
    ["previewPoint", "previewLine", "previewCircle", "previewPolygon", "previewPencil"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
}


/* =========================================================
   SAVE AS PNG
   ========================================================= */

saveButton.addEventListener("click", saveAsPNG);

function saveAsPNG() {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = SVG_WIDTH;
        canvas.height = SVG_HEIGHT;
        const context = canvas.getContext("2d");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, SVG_WIDTH, SVG_HEIGHT);
        context.drawImage(image, 0, 0);

        URL.revokeObjectURL(url);

        const download = document.createElement("a");
        download.download = "geometrichna-daska.png";
        download.href = canvas.toDataURL("image/png");
        download.click();
    };

    image.src = url;
}


/* =========================================================
   INITIAL STATE
   ========================================================= */

gridButton.classList.add("active");
labelsButton.classList.add("active");
render();

/* =========================================================
   KEYBOARD SHORTCUTS & APP EXPORT
   ========================================================= */

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
            redo();
        } else {
            undo();
        }
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redo();
    } else if (e.key === "Escape") {
        setTool("select");
    } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedObjectId) {
            saveState();
            objects = objects.filter(o => o.id !== selectedObjectId);
            selectedObjectId = null;
            render();
        }
    }
});

window.app = {
    undo,
    redo,
    clear: () => clearButton.click(),
    save: saveAsPNG,
    setTool
};

