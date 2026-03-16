// import { reportService } from "@/modules/report/report.service"
// import { sendSuccess, sendError } from "@/utils/response"


// export async function GET() {
    
//     try {
    
//         const purchases = await reportService.getPurchaseReport()

//         return sendSuccess(purchases)

//     } catch (error) {
    
//         return sendError("Purchase report error", 500, error)

//     }

// }

import { reportController } from "@/modules/report/report.controller";
export async function GET() {

    return reportController.purchaseReport()

}