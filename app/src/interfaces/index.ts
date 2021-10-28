/**
 * Sidebar
 */
interface SidebarElement {
    as: string;
    text: string;
    icon: URL;
}

interface SidebarElements {
    legend: string;
    type: string;
    elements: Array<SidebarElement>
}

export interface SidebarContext {
    components: Array<SidebarElements>
}

/**
 * Layout
 */
export interface LayoutContext {

}


/**
 * App
 */
export interface AppContext {
    sidebar: SidebarContext[];
    layout: LayoutContext[];
}

interface SidebarElementContext {
    element: HTMLElement | any;
    pointerId: number;
    startX: number;
    startY: number;
}

type SidebarElementEvent = {
    type: string;
    originalEvent: object;
    originalContext: object;
}

type SidebarElementState =
    | { value: "idle"; context: SidebarElementContext }
    | { value: "dragging"; context: SidebarElementContext }
    | { value: "dropped"; context: SidebarElementContext };
