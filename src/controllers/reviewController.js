const bookModel = require("../models/bookModel");
const reviewModel=require("../models/reviewModel")

const valid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === "string" && value.trim().length == 0) return false
    return true
}

const alphaOnly = function (value) {
    let regexaAlpha = /^[A-Za-z]+$/
    return regexaAlpha.test(value)
}


const createReview = async function (req, res) {
    try {

        let bookId=req.params.bookId
        let book=await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!book)return res.status(404).send({status:false,message:"book not found !"})

        let reviewDetail=req.body
        let {review,rating,reviewedBy}=reviewDetail

        if(review){
            if(!valid(review))return res.status(400).send({ status: false, message: "review is invalid.." })
        }

        if(!rating)return res.status(400).send({ status: false, message: "rating is mandatory" })
        let regexRating=/^[+]?([1-4]*\.[0-9]+|[1-5])/
        if(!regexRating.test(rating))return res.status(400).send({ status: false, message: "rating should be in between 1-5" })


        if(reviewedBy){
            if(!valid(reviewedBy))return res.status(400).send({ status: false, message: "please give reviewer's name" })
            if(!alphaOnly(reviewedBy))return res.status(400).send({ status: false, message: "please give valid reviewer's name..." })
        }else{
            reviewedBy="Guest"
        }
        

        let reviewedAt=Date.now()

        let reviewData={bookId,reviewedBy,reviewedAt,rating,review}

        let reviewsData1=await reviewModel.create(reviewData)
        let reviewsData=await reviewModel.find({_id:reviewsData1._id}).select({isDeleted:0})
      
        if(reviewsData1){
        book.reviews +=1
        await book.save()
        }

        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt } = book

        const updatedBook = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt, reviewsData }
  
        return res.status(200).send({ status: true, message: "Success", data:updatedBook})     
      

    }
    catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
      }
      module.exports.createReview=createReview



