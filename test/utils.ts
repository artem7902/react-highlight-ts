export class SelectionImpl implements Selection{
    public anchorNode: Node|null;
    public anchorOffset: number;
    public focusNode: Node|null;
    public focusOffset: number;
    public isCollapsed: boolean;
    public rangeCount: number;
    public type: string;
    private ranges: Range[];
    constructor(){
        this.anchorNode = null;
        this.anchorOffset = 0;
        this.focusNode = null;
        this.focusOffset = 0;
        this.isCollapsed = false;
        this.rangeCount = 1;
        this.type = "test";
        this.ranges = [];
    }
    addRange(range: Range): void {
        this.ranges.push(range);
    }
    collapse(node: Node, offset?: number): void {
        throw new Error("Method not implemented.");
    }
    collapseToEnd(): void {
        throw new Error("Method not implemented.");
    }
    collapseToStart(): void {
        throw new Error("Method not implemented.");
    }
    containsNode(node: Node, allowPartialContainment?: boolean): boolean {
        throw new Error("Method not implemented.");
    }
    deleteFromDocument(): void {
        throw new Error("Method not implemented.");
    }
    empty(): void {
        throw new Error("Method not implemented.");
    }
    extend(node: Node, offset?: number): void {
        throw new Error("Method not implemented.");
    }
    getRangeAt(index: number): Range {
        return this.ranges[index];
    }
    removeAllRanges(): void {
        this.ranges=[]
    }
    removeRange(range: Range): void {
        throw new Error("Method not implemented.");
    }
    selectAllChildren(node: Node): void {
        throw new Error("Method not implemented.");
    }
    setBaseAndExtent(anchorNode: Node, anchorOffset: number, focusNode: Node, focusOffset: number): void {
        throw new Error("Method not implemented.");
    }
    setPosition(node: Node, offset?: number): void {
        throw new Error("Method not implemented.");
    }


}

export class RangeImpl implements Range{
    END_TO_END: number;
    END_TO_START: number;
    START_TO_END: number;
    START_TO_START: number;
    collapsed: boolean;
    endContainer: any;
    endOffset: number;
    startContainer: any;
    startOffset: number;
    commonAncestorContainer: any;
    
    constructor(){
        this.END_TO_END = 0;
        this.END_TO_START = 0;
        this.START_TO_END = 0;
        this.START_TO_START = 0;
        this.collapsed = false;
        this.endOffset = 0;
        this.startOffset = 0;
    }

    cloneContents(): DocumentFragment {
        throw new Error("Method not implemented.");
    }
    cloneRange(): Range {
        throw new Error("Method not implemented.");
    }
    collapse(toStart?: boolean): void {
        throw new Error("Method not implemented.");
    }
    compareBoundaryPoints(how: number, sourceRange: Range): number {
        throw new Error("Method not implemented.");
    }
    comparePoint(node: Node, offset: number): number {
        throw new Error("Method not implemented.");
    }
    createContextualFragment(fragment: string): DocumentFragment {
        throw new Error("Method not implemented.");
    }
    deleteContents(): void {
        throw new Error("Method not implemented.");
    }
    detach(): void {
        throw new Error("Method not implemented.");
    }
    extractContents(): DocumentFragment {
        throw new Error("Method not implemented.");
    }
    getBoundingClientRect(): DOMRect {
        throw new Error("Method not implemented.");
    }
    getClientRects(): DOMRectList {
        throw new Error("Method not implemented.");
    }
    insertNode(node: Node): void {
        throw new Error("Method not implemented.");
    }
    intersectsNode(node: Node): boolean {
        throw new Error("Method not implemented.");
    }
    isPointInRange(node: Node, offset: number): boolean {
        throw new Error("Method not implemented.");
    }
    selectNode(node: Node): void {
        throw new Error("Method not implemented.");
    }
    selectNodeContents(node: Node): void {
        throw new Error("Method not implemented.");
    }
    setEnd(node: Node, offset: number): void {
        this.endContainer = node;
        this.endOffset = offset;
    }
    setEndAfter(node: Node): void {
        throw new Error("Method not implemented.");
    }
    setEndBefore(node: Node): void {
        throw new Error("Method not implemented.");
    }
    setStart(node: Node, offset: number): void {
        this.startContainer = node;
        this.startOffset = offset;
    }
    setStartAfter(node: Node): void {
        throw new Error("Method not implemented.");
    }
    setStartBefore(node: Node): void {
        throw new Error("Method not implemented.");
    }
    surroundContents(newParent: Node): void {
        throw new Error("Method not implemented.");
    }
}