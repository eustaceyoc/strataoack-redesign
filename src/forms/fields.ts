export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const maxCvBytes = 5 * 1024 * 1024

export function cvError(file: File | null) {
	if (!file || file.size === 0) return null
	const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
	if (!["pdf", "doc", "docx"].includes(extension)) return "Attach a PDF, DOC, or DOCX file"
	if (file.size > maxCvBytes) return "The CV must be 5 MB or smaller"
	return null
}
