// import { reportService } from "@/modules/report/report.service"
// import { sendSuccess, sendError } from "@/utils/response"


// export async function GET() {
    
//     try {

//         const imports = await reportService.getImportReport()

//         return sendSuccess(imports)

//     } catch (error) {
    
//         return sendError("Internal Import Report Server Error", 500, error)

//     }

// }


import { reportController } from "@/modules/report/report.controller";
export async function GET() {

    return reportController.importReport()

}