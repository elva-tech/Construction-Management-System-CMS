import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { DraftingCompass, Search, Upload, X, Eye, FileText, Image, Check, X as XMark } from "lucide-react";
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useToast } from '../context/ToastContext';
import { useProject } from '../context/ProjectContext';
import drawingService from '../services/drawingService';

const statusClasses = {
  Approved: "text-green-600 border border-green-500 px-2 py-0.5 rounded-full text-xs",
  Rejected: "text-red-600 border border-red-500 px-2 py-0.5 rounded-full text-xs",
  Submitted: "text-blue-600 border border-blue-500 px-2 py-0.5 rounded-full text-xs",
  Resubmitted: "text-blue-600 border border-blue-500 px-2 py-0.5 rounded-full text-xs",
  Reupload: "bg-red-500 text-white px-2 py-0.5 rounded-full text-xs cursor-pointer hover:bg-red-600",
};

function FilterIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  );
}

function CustomButton({ children, className, variant = "solid", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      : "bg-red-600  text-white";

  return (
    <button
      className={`px-4 py-2 rounded-md text-md transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function CustomInput({ className, ...props }) {
  return (
    <div className="relative">
      <input
        type="text"
        className="border rounded-md pl-10 py-2"
        placeholder="Search"
      // value={searchTerm}
      // onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}

// Upload Drawing Modal Component
const UploadDrawingModal = ({ isOpen, onClose, onUpload, selectedDrawing, onResubmit }) => {
  const [drawingName, setDrawingName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedDrawing) {
      setDrawingName(selectedDrawing.name);
    }
  }, [selectedDrawing]);

  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp", "image/tiff"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setError("");
      } else {
        setSelectedFile(null);
        setError("Please select a PDF or image file");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!drawingName.trim()) {
      setError("Please enter a drawing name");
      return;
    }
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    if (selectedDrawing) {
      // This is a resubmission
      onResubmit({ ...selectedDrawing, file: selectedFile });
    } else {
      // This is a new submission
      onUpload({ name: drawingName, file: selectedFile });
    }
    // Reset form
    setDrawingName("");
    setSelectedFile(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedDrawing ? "Resubmit Drawing" : "Upload Drawing"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drawing Name
            </label>
            <input
              type="text"
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter drawing name"
              disabled={selectedDrawing}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File (PDF or Image)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "Click to upload PDF or image"}
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              {selectedDrawing ? "Resubmit" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Drawing Modal Component
// Supports both:
// 1. Local file (File object) — newly uploaded in this session
// 2. S3 URL (file_url string) — previously uploaded and stored in S3
const ViewDrawingModal = ({ isOpen, onClose, drawing, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !drawing) return null;

  // Determine source — local file takes priority over S3 URL
  const hasLocalFile = !!drawing.file;
  const hasS3Url = !!drawing.file_url;

  // Detect file type from local file OR from S3 URL extension
  const isPDF = hasLocalFile
    ? drawing.file.type === "application/pdf"
    : hasS3Url && drawing.file_url.startsWith('data:application/pdf') ;

  const isImage = hasLocalFile
    ? drawing.file.type.startsWith("image/")
    : hasS3Url && !isPDF;

  // Get viewable src — local blob URL or direct S3 URL
  const getViewSrc = () => {
    if (hasLocalFile) return URL.createObjectURL(drawing.file);
    if (hasS3Url) return drawing.file_url;
    return null;
  };

  const viewSrc = getViewSrc();

  const addWatermarkToImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const watermarkText = 'APPROVED';

        // Calculate diagonal length from top-left to bottom-right
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);

        // Calculate font size to fit the diagonal
        let fontSize = diagonal * 0.08;

        // Ensure minimum and maximum readable sizes
        fontSize = Math.max(fontSize, 20);
        fontSize = Math.min(fontSize, diagonal * 0.12);

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.measureText(watermarkText);

        // Calculate the angle for diagonal placement (top-left to bottom-right)
        const angle = Math.atan2(-canvas.height, canvas.width);

        // Set watermark style
        ctx.fillStyle = 'rgba(180, 180, 180, 0.3)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw single diagonal watermark from top-left to bottom-right
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
        canvas.toBlob((blob) => {
          const watermarkedFile = new File([blob], file.name, { type: file.type });
          resolve(watermarkedFile);
        }, file.type);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Fetch S3 file as blob for watermarking (when only S3 URL available)
  const fetchFileFromS3 = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename || 'drawing', { type: blob.type });
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      let watermarkedFile;
      // Get the file — from local or fetch from S3
      const fileToProcess = hasLocalFile
        ? drawing.file
        : await fetchFileFromS3(drawing.file_url, drawing.name);

      if (isPDF) {
        console.log('Processing PDF...');
        const fileReader = new FileReader();

        const pdfBytes = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(fileToProcess);
        });

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          const watermarkText = 'APPROVED';

          // Calculate diagonal length from top-left to bottom-right
          const diagonal = Math.sqrt(width * width + height * height);

          // Calculate font size to fit the diagonal
          let fontSize = diagonal * 0.08;

          // Ensure minimum and maximum readable sizes
          fontSize = Math.max(fontSize, 30);
          fontSize = Math.min(fontSize, diagonal * 0.12);

          const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);

          // Calculate the angle for diagonal placement (top-left to bottom-right)
          const angle = Math.atan2(-height, width);

          // Calculate center position
          const centerX = width / 2;
          const centerY = height / 2;

          // Draw single diagonal watermark from top-left to bottom-right
          page.drawText(watermarkText, {
            x: centerX - (textWidth / 2),
            y: centerY,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0.7, 0.7, 0.7),
            opacity: 0.3,
            rotate: degrees(angle * (180 / Math.PI)),
          });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        watermarkedFile = new File([modifiedPdfBytes], fileToProcess.name, { type: 'application/pdf' });
      } else if (isImage) {
        console.log('Processing image...');
        watermarkedFile = await addWatermarkToImage(fileToProcess);
      } else {
        throw new Error('Unsupported file type');
      }

      onStatusChange(drawing.id, "Approved", watermarkedFile);
      showToast(`Drawing "${drawing.name}" has been approved`, 'success');
      onClose();
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        errorObject: error
      });
      showToast(
        error.message === 'Page too small to fit watermark properly'
          ? 'Page size too small to add watermark properly'
          : 'Failed to approve drawing',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    onStatusChange(drawing.id, "Rejected");
    showToast(`Drawing "${drawing.name}" rejected`, 'error');
    onClose();
  };

  const showActionButtons = () => {
    // Show buttons only if:
    // 1. Status is "Submitted" (first submission)
    // 2. Status is "Resubmitted" (after rejection)
    return drawing.status === "Submitted" || drawing.status === "Resubmitted";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{drawing.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {!viewSrc ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No file available
            </div>
          ) : isPDF ? (
            <iframe
              src={viewSrc}
              className="w-full h-[70vh]"
              title={drawing.name}
            />
          ) : (
            <img
              src={viewSrc}
              alt={drawing.name}
              className="max-w-full max-h-[70vh] mx-auto"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          {showActionButtons() && (hasLocalFile || hasS3Url) && (
            <>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMark size={16} className="mr-1" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} className="mr-1" />
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Billing = () => {
  const location = useLocation();
  const { selectedProject } = useProject();

  // PRODUCTION: fetch drawings from API — no mock fallback
  const [drawings, setDrawings] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);

  // Fetch drawings from API on mount
  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const res = await drawingService.getAll(selectedProject?.id);
        console.log("[Billing] API response:", res);
        // apiService fetch wrapper returns response.json() directly — res = { success, data: [] }
        const rows = res?.data ?? [];
        const mapped = rows.map((row, idx) => ({
          id: row.id,
          no: String(idx + 1).padStart(2, '0'),
          name: row.particulars ?? '',
          status: row.status ?? 'Submitted',
          // file is null on load — user uploads locally in browser session
          file: null,
          // file_url is the S3 URL stored in DB — used for viewing previously uploaded files
          file_url: row.file_url ?? null
        }));
        setDrawings(mapped);
      } catch (e) {
        console.error("[Billing] fetchDrawings error:", e);
        // On error — show empty, no mock fallback
        setDrawings([]);
      }
    };
    fetchDrawings();
  }, [selectedProject?.id]);

  // Function to handle drawing upload — sends file to backend → S3 → saves S3 URL in DB
  const handleDrawingUpload = async (drawingData) => {
    try {
      const projectId = selectedProject?.id ?? 1;
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('particulars', drawingData.name);
      formData.append('drawing_file', drawingData.file);

      const res = await drawingService.create(formData);
      console.log("[Billing] create drawing response:", res);

      const newDrawing = {
        id: res?.data?.id ?? drawings.length + 1,
        no: String(drawings.length + 1).padStart(2, '0'),
        name: drawingData.name,
        status: "Submitted",
        file: drawingData.file,
        // S3 URL returned from backend
        file_url: res?.data?.file_url ?? null
      };
      setDrawings([...drawings, newDrawing]);
    } catch (e) {
      console.error("[Billing] handleDrawingUpload error:", e);
    }
  };

  // Function to handle status change — sends watermarked file to S3 via backend + updates DB status
  const handleStatusChange = async (drawingId, newStatus, newFile = null) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      if (newFile) {
        // This is the watermarked file — backend uploads it to S3 and saves new URL
        formData.append('drawing_file', newFile);
      }
      const res = await drawingService.update(drawingId, formData);
      console.log("[Billing] status updated:", drawingId, newStatus);

      setDrawings(drawings.map(drawing => {
        if (drawing.id === drawingId) {
          return {
            ...drawing,
            status: newStatus,
            file: newFile || drawing.file,
            // Update file_url to new S3 URL if file was replaced
            file_url: res?.data?.file_url ?? drawing.file_url
          };
        }
        return drawing;
      }));
    } catch (e) {
      console.error("[Billing] handleStatusChange error:", e);
      // Still update local status even if API fails
      setDrawings(drawings.map(drawing => {
        if (drawing.id === drawingId) {
          return { ...drawing, status: newStatus, file: newFile || drawing.file };
        }
        return drawing;
      }));
    }
  };

  // Function to handle resubmission — sends new file to S3 via backend + updates status
  const handleResubmission = async (drawing) => {
    try {
      const formData = new FormData();
      formData.append('status', 'Resubmitted');
      formData.append('drawing_file', drawing.file);
      const res = await drawingService.update(drawing.id, formData);
      console.log("[Billing] resubmission updated:", drawing.id);

      setDrawings(drawings.map(d => {
        if (d.id === drawing.id) {
          return {
            ...d,
            status: "Resubmitted",
            file: drawing.file,
            // Update file_url to new S3 URL
            file_url: res?.data?.file_url ?? d.file_url
          };
        }
        return d;
      }));
    } catch (e) {
      console.error("[Billing] handleResubmission error:", e);
      // Still update local status even if API fails
      setDrawings(drawings.map(d => {
        if (d.id === drawing.id) {
          return { ...d, status: "Resubmitted", file: drawing.file };
        }
        return d;
      }));
    }
  };

  // Function to handle drawing view
  const handleViewDrawing = (drawing) => {
    // Can view if local file exists OR S3 URL exists
    if (drawing.file || drawing.file_url) {
      setSelectedDrawing(drawing);
      setIsViewModalOpen(true);
    } else {
      // No file at all — prompt to upload
      const shouldUpload = window.confirm("No file available for this drawing. Would you like to upload one?");
      if (shouldUpload) {
        setSelectedDrawing(drawing);
        setIsUploadModalOpen(true);
      }
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={DraftingCompass} />
      <div className="px-6 py-4  mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <div className="flex gap-2 items-center">
            <CustomButton variant="outline" className="flex items-center gap-2">
              <FilterIcon className="w-6 h-6" />
              Filter
            </CustomButton>
            <CustomInput
              type="text"
              placeholder="Search"
              className="max-w-xs"
            />
          </div>
          <CustomButton
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Drawing
          </CustomButton>
        </div>

        <table className="w-full table-auto text-left bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-200 border-b border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold">NO.</th>
              <th className="p-3 text-sm font-semibold">Particulars</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">File Type</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {drawings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">No drawings found</td>
              </tr>
            ) : (
              drawings.map((drawing) => (
                <tr
                  key={drawing.id}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3 font-medium">{drawing.no}</td>
                  <td className="p-3 text-red-600 font-medium">{drawing.name}</td>
                  <td className="p-3 space-x-2">
                    {drawing.status === "Rejected" ? (
                      <>
                        <span className={statusClasses[drawing.status]}>
                          {drawing.status}
                        </span>
                        <span
                          className={statusClasses["Reupload"]}
                          onClick={() => {
                            setSelectedDrawing(drawing);
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Re-Upload
                        </span>
                      </>
                    ) : (
                      <span className={statusClasses[drawing.status]}>
                        {drawing.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {drawing.file ? (
                      // Local file in session
                      <div className="flex items-center">
                        {drawing.file.type === "application/pdf" ? (
                          <FileText size={16} className="text-red-500 mr-1" />
                        ) : (
                          <Image size={16} className="text-blue-500 mr-1" />
                        )}
                        <span className="text-xs">
                          {drawing.file.type === "application/pdf" ? "PDF" : "Image"}
                        </span>
                      </div>
                    ) : drawing.file_url ? (
                      // S3 file from DB
                      <div className="flex items-center">
                        {drawing.file_url.startsWith('data:application/pdf') ? (
                          <FileText size={16} className="text-red-500 mr-1" />
                        ) : (
                          <Image size={16} className="text-blue-500 mr-1" />
                        )}
                        <span className="text-xs">
                          {drawing.file_url.startsWith('data:application/pdf') ? "PDF" : "Image"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="p-3">
                    <CustomButton
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                      onClick={() => handleViewDrawing(drawing)}
                    >
                      <Eye size={14} />
                      View
                    </CustomButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Drawing Modal */}
      <UploadDrawingModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedDrawing(null);
        }}
        onUpload={handleDrawingUpload}
        selectedDrawing={selectedDrawing}
        onResubmit={handleResubmission}
      />

      {/* View Drawing Modal */}
      <ViewDrawingModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDrawing(null);
        }}
        drawing={selectedDrawing}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default Billing;








// ─── Billing.jsx — Key Lines Reference ───────────────────────────────────────
//
// FILE TYPE DETECTION (File Type column in table):
//   ~Line 338-355 : checks drawing.file (local) first, then drawing.file_url (S3/base64)
//
// ViewDrawingModal — file handling:
//   ~Line 160-161 : hasLocalFile / hasS3Url — detects which source is available
//   ~Line 163-168 : isPDF / isImage — from local file type OR S3 URL extension
//   ~Line 170-174 : getViewSrc() — returns local blob URL or S3/base64 URL
//   ~Line 248     : fetchFileFromS3() — fetches S3 file as blob for watermarking
//   ~Line 256-261 : handleApprove — uses local file OR fetches from S3 for watermark
//   ~Line 310-322 : <iframe> / <img> — renders using viewSrc (local or S3)
//
// Billing component — upload/view:
//   ~Line 393-414 : handleDrawingUpload — sends FormData to backend, gets file_url back
//   ~Line 416-437 : handleStatusChange — sends watermarked file, updates file_url in state
//   ~Line 439-456 : handleResubmission — sends new file, updates file_url in state
//   ~Line 458-468 : handleViewDrawing — opens modal if drawing.file OR drawing.file_url exists
//
// ─── drawing.controller.js — Key Lines Reference ─────────────────────────────
//
//   ~Line 42      : multer.memoryStorage() — no local folder, file stays in RAM
//   ~Line 80-83   : createDrawing — base64 conversion (DEMO); replace with req.file.location (S3)
//   ~Line 122-126 : updateDrawing — base64 conversion (DEMO); replace with req.file.location (S3)
//
// ─────────────────────────────────────────────────────────────────────────────