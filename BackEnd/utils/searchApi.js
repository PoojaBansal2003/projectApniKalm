class ApiSearch {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword
         ? {
            productName : {
                $regex : this.queryStr.keyword,
                $options : "i",
            },
        }
        : {}

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};

        /* Removing some feilds for Category  */
        const removeField = ["keyword", "page", "limit"];

        removeField.forEach((key) => delete queryCopy[key]);


        /* For Price Range */
        let querryStr = JSON.stringify(queryCopy);
        querryStr = querryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(querryStr));
        return this; 
    }

    pagination(resultPerPage){
        const currPage = Number(this.queryStr.page) || 1
        
        const skip = resultPerPage*(currPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }

}

module.exports = ApiSearch;