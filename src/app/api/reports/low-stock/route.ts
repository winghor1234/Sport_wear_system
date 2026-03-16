// import { reportService } from "@/modules/report/report.service"
// import { sendSuccess, sendError } from "@/utils/response"


// export async function GET() {
    
//     try {
    
//         const products = await reportService.getLowStockProducts()

//         return sendSuccess(products)

//     } catch (error) {
    
//         return sendError("Low stock report error", 500, error)

//     }

// }


import { reportController } from "@/modules/report/report.controller";
export async function GET() {

    return reportController.lowStockReport()

}