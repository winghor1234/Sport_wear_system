import PDFDocument from "pdfkit"

export function exportToPdf(data: any[]) {

    const doc = new PDFDocument()

    const buffers: any[] = []

    doc.on("data", buffers.push.bind(buffers))

    data.forEach((item) => {
        doc.text(JSON.stringify(item))
        doc.moveDown()
    })

    doc.end()

    return new Promise<Buffer>((resolve) => {

        doc.on("end", () => {

            const pdf = Buffer.concat(buffers)

            resolve(pdf)

        })

    })

}