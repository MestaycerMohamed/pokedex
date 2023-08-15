export class Pokemon {
    public id : number | null;
    public name : string | null ;
    public color : string | null ;
    public imgUrl : string | null ;
    public types : any[] | null;
    public description : string | null ;
    public stats : any[] | null;
    public evolChain : any[] | null;
    constructor(id?:number,name?:string,color?:string,imgUrl?:string,types?:any[],description?:string,stats?: any[],evolChain?: any[]){
        this.id = id ?? null;
        this.name = name ?? "";
        this.color = color ?? "";
        this.imgUrl = imgUrl ?? "";
        this.types = types ?? [];
        this.description = description ?? "";
        this.stats = stats ?? [];
        this.evolChain = evolChain ?? [];
    }
    
}