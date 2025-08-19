import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Menu } from 'primereact/menu';
import { Messages } from 'primereact/messages';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ChromePicker } from "react-color";
import { useTeamContext } from '../context/TeamContext';
import { useParams } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import {
    CheckCircle,
    Loader2,
    MessageCircle,
    XCircle,
    CirclePlus,
    Search,
    User,
    Tag,
    Paperclip,
    Play,
    Pause,
    Plus,
    Trash2,
    ChevronRight,
    Info,
    CircleX,
    FileUp,
    Download,
    Eye,
} from 'lucide-react';
import {
    ExclamationTriangleIcon,
    PauseCircleIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    ArchiveBoxIcon,
    InboxIcon,
    TruckIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';


// Custom styles for PhoneInput and Toast Messages
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    transition: border-color 0.2s;
  }
  
  .PhoneInput:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  .PhoneInputCountry {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-right: 1px solid #d1d5db;
    background: #f9fafb;
  }
  
  .PhoneInputCountrySelect {
    border: none;
    background: transparent;
    font-size: 14px;
    padding: 0.5rem;
    outline: none;
  }
  
  .PhoneInputInput {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 14px;
  }
  
  .PhoneInputInput::placeholder {
    color: #9ca3af;
  }

  /* Toast Message Styles */
  .p-message {
    margin-bottom: 0.5rem !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    animation: slideInRight 0.3s ease-out !important;
    z-index: 9999 !important;
    position: relative !important;
  }
  
  .p-message.p-message-success {
    background: #f0fdf4 !important;
    border: 1px solid #bbf7d0 !important;
    color: #166534 !important;
  }
  
  .p-message.p-message-success .p-message-icon {
    color: #16a34a !important;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Messages Container - Highest Z-Index */
  .p-messages {
    z-index: 9999 !important;
    position: fixed !important;
  }
`;

// Label interface
interface Label {
    id: string;
    name: string;
    icon: any;
    color: string;
    bgColor: string;
    textColor: string;
    isCustom?: boolean;
}

export default function OrderDetails() {
    const { id } = useParams<{ id: string }>();
    const { teamMembers, assignOrderToMember, unassignOrderFromMember } = useTeamContext();

    const [qrOpen, setQrOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
    const [customerInfoOpen, setCustomerInfoOpen] = useState(false);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [additionalOrderOpen, setAdditionalOrderOpen] = useState(false);
    const [labelDialogOpen, setLabelDialogOpen] = useState(false);
    const [customLabelDialogOpen, setCustomLabelDialogOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number[]>([0]);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('Work in Progress');
    const [customLabelName, setCustomLabelName] = useState('');
    const [customLabelColor, setCustomLabelColor] = useState('#3B82F6');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionText, setDescriptionText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<Array<{
        id: string;
        name: string;
        type: string;
        size: string;
        uploadedAt: string;
        file: File;
        preview?: string;
    }>>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [viewFileOpen, setViewFileOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ name: string; preview?: string; type: string } | null>(null);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<Array<{
        id: string;
        name: string;
        type: string;
        size: string;
        file: File;
        preview?: string;
    }>>([]);
    const [customerInfo, setCustomerInfo] = useState({
        referenceNumber: 'ORD-2025-001',
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        notes: '',
        customerType: 'Regular',
        isEditing: false
    });
    const [additionalOrder, setAdditionalOrder] = useState({
        title: '',
        price: '',
        description: '',
        customerWillPay: false
    });

    const menuRef = useRef<Menu>(null);
    const messagesRef = useRef<Messages>(null);

    // Predefined labels
    const predefinedLabels: Label[] = [
        { id: 'high-priority', name: 'High Priority', icon: ExclamationTriangleIcon, color: '#EF4444', bgColor: 'bg-red-100', textColor: 'text-red-600' },
        {
            id: 'on-hold',
            name: 'On Hold',
            icon: PauseCircleIcon,
            color: '#F59E0B',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600'
        },
        {
            id: 'completed',
            name: 'Completed',
            icon: CheckCircleIcon,
            color: '#10B981',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            id: 'in-progress',
            name: 'In Progress',
            icon: ArrowPathIcon,
            color: '#3B82F6',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            id: 'waiting-reply',
            name: 'Waiting for Reply',
            icon: ChatBubbleLeftRightIcon,
            color: '#8B5CF6',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        },
        {
            id: 'waiting-parts',
            name: 'Waiting for Parts',
            icon: ArchiveBoxIcon,
            color: '#F97316',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
        },
        {
            id: 'received',
            name: 'Received',
            icon: InboxIcon,
            color: '#6B7280',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-600'
        },
        {
            id: 'ready-pickup',
            name: 'Ready for Pickup',
            icon: TruckIcon,
            color: '#6366F1',
            bgColor: 'bg-indigo-100',
            textColor: 'text-indigo-600'
        },
        {
            id: 'cancelled',
            name: 'Cancelled',
            icon: XCircleIcon,
            color: '#6B7280',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-600'
        },
    ];


    // Custom labels state
    const [customLabels, setCustomLabels] = useState<Label[]>([]);

    // Initialize selected label
    useEffect(() => {
        if (!selectedLabel) {
            setSelectedLabel(predefinedLabels[0]); // Default to High Priority
        }
    }, []);

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timerRunning && !isPaused) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerRunning, isPaused]);

    // Click outside handler for menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const menu = menuRef.current;
            // Check menu and menu.getElement exist AND menuElement exists
            if (
                menu &&
                typeof menu.getElement === 'function'
            ) {
                const menuElement = menu.getElement();
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    menu.hide?.(event as any); // menu is guaranteed non-null here
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);






    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Utility function to truncate file names
    const truncateFileName = (fileName: string, maxLength: number = 25) => {
        if (fileName.length <= maxLength) return fileName;

        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // No extension, just truncate the name
            return fileName.substring(0, maxLength - 3) + '...';
        }

        const name = fileName.substring(0, lastDotIndex);
        const extension = fileName.substring(lastDotIndex);

        if (extension.length >= maxLength - 3) {
            // Extension is too long, just show extension
            return '...' + extension;
        }

        const availableLength = maxLength - extension.length - 3; // 3 for "..."
        const truncatedName = name.substring(0, availableLength);

        return truncatedName + '...' + extension;
    };

    // Get all labels (predefined + custom)
    const getAllLabels = (): Label[] => {
        return [...predefinedLabels, ...customLabels];
    };

    // Check if color is already used
    const isColorUsed = (color: string): boolean => {
        return getAllLabels().some(label => label.color === color);
    };

    // Generate background and text colors from hex
    const generateColorsFromHex = (hexColor: string) => {
        // Remove # from hex color for Tailwind
        const colorWithoutHash = hexColor.replace('#', '');
        const bgColor = `bg-[#${colorWithoutHash}]/10`;
        const textColor = `text-[#${colorWithoutHash}]`;
        return { bgColor, textColor };
    };

    // Handle custom label creation
    const handleCreateCustomLabel = () => {
        if (!customLabelName.trim()) return;

        if (isColorUsed(customLabelColor)) {
            alert('This color is already used by another label. Please choose a different color.');
            return;
        }

        const { bgColor, textColor } = generateColorsFromHex(customLabelColor);

        const newCustomLabel: Label = {
            id: `custom-${Date.now()}`,
            name: customLabelName.trim(),
            icon: Tag,
            color: customLabelColor,
            bgColor,
            textColor,
            isCustom: true
        };

        setCustomLabels(prev => [...prev, newCustomLabel]);
        setCustomLabelName('');
        setCustomLabelColor('#3B82F6');
        setCustomLabelDialogOpen(false);
    };

    // Handle label selection
    const handleLabelSelect = (label: Label) => {
        setSelectedLabel(label);
        setLabelDialogOpen(false);
    };

    // Handle custom label deletion
    const handleDeleteCustomLabel = (labelId: string) => {
        setCustomLabels(prev => prev.filter(label => label.id !== labelId));
        if (selectedLabel?.id === labelId) {
            setSelectedLabel(predefinedLabels[0]); // Reset to default if deleted label was selected
        }
    };

    // Mock data
    const order = {
        id: id || '17',
        label: 'High Priority',
        assigned: true,
        assignedUser: { name: 'John Doe', avatar: '/images/avatar/user1.jpg' },
        state: 'Work in Progress',
        paid: true,
        paymentMethod: 'Online',
        customerWillPay: false,
        customer: {
            fullName: 'John Smith',
            email: 'john.smith@example.com',
            phoneCode: '+1',
            phoneNumber: '555-123-4567',
            address: '123 Main Street, New York, NY 10001',
            notes: 'Customer prefers morning appointments'
        },
        serviceLog: [
            { name: 'Brake Adjustment', qty: 1, rate: 500, amount: 500 },
            { name: 'Chain Replacement', qty: 1, rate: 800, amount: 800 },
            { name: 'Tire Replacement', qty: 1, rate: 400, amount: 400 },
        ],
        total: 1700,
        description: 'Reduce noise, Install new chain.',
        log: [
            { text: 'Order created and received from customer', date: 'Mar 13, 2025; 18:00:45', notes: 'Customer dropped off equipment for repair', status: 'Drop by customer' },
            { text: 'Order acknowledged and logged into system', date: 'Mar 13, 2025; 18:15:30', notes: 'Initial assessment completed', status: 'Received' },
            { text: 'Work started on equipment', date: 'Mar 14, 2025; 09:00:00', notes: 'Begin brake adjustment and chain replacement', status: 'Work in Progress' },
            { text: 'Waiting for customer approval on additional services', date: 'Mar 14, 2025; 14:30:00', notes: 'Customer needs to approve tire replacement cost', status: 'Waiting for Customer Reply' },
        ],
        attachments: [
            { name: 'invoice.pdf', type: 'pdf', size: '2.3 MB' },
            { name: 'photo.jpg', type: 'image', size: '1.1 MB' },
        ],
        comments: [
            { user: 'John Doe', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.' },
            { user: 'Jane Smith', avatar: '/images/avatar/user1.jpg', date: 'Mar 13,2025', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        ],
        requests: 2,
    };
    const [isPaid, setIsPaid] = useState(order.paid ?? false);
    const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod ?? '');
    const [customerWillPay, setCustomerWillPay] = useState(order.customerWillPay ?? false);



    // Initialize customer info and description once per order id
    useEffect(() => {
        if (order.customer) {
            setCustomerInfo({
                referenceNumber: `ORD-${order.id.toString().padStart(4, '0')}`,
                fullName: order.customer.fullName,
                email: order.customer.email,
                phoneNumber: order.customer.phoneNumber,
                address: order.customer.address,
                notes: order.customer.notes,
                customerType: 'Regular',
                isEditing: false
            });
        }
        // Set initial editable description; do not reset on every re-render
        setDescriptionText(order.description || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fileMenuItems = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => { console.log('Edit'); } },
        { label: 'View', icon: 'pi pi-eye', command: () => { console.log('View'); } },
        { label: 'Download', icon: 'pi pi-download', command: () => { console.log('Download'); } },
        { label: 'Delete', icon: 'pi pi-trash', command: () => { console.log('Delete'); } },
    ];

    const handleTimerToggle = () => {
        if (timerRunning) {
            // Stop the timer
            setTimerRunning(false);
            setIsPaused(false);
            setTimerSeconds(0); // Reset timer when stopping
        } else {
            // Start the timer
            setTimerRunning(true);
            setIsPaused(false);
        }
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const handleMarkComplete = () => {
        setSelectedStatus('Completed');
        // Additional logic for marking complete
    };

    const handleOnHold = () => {
        setSelectedStatus('On Hold');
        // Additional logic for on hold
    };

    // Get current assigned member
    const currentAssignedMember = teamMembers.find(member =>
        member.assignedOrders.includes(order.id)
    );

    // Handle team member assignment
    const handleAssignMember = (memberId: string) => {
        assignOrderToMember(order.id, memberId);
        setAssignOpen(false);
    };

    // Handle unassigning member
    const handleUnassignMember = () => {
        unassignOrderFromMember(order.id);
    };

    // File handling functions
    const handleFileSelection = (files: FileList) => {
        const newSelectedFiles = Array.from(files).map(file => {
            const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
            const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
            const fileType = file.type.startsWith('image/') ? 'image' :
                file.type.includes('pdf') ? 'pdf' :
                    file.type.includes('sheet') || file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls') ? 'excel' :
                        file.type.includes('word') || file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc') ? 'word' :
                            'document';

            let preview: string | undefined;
            if (file.type.startsWith('image/')) {
                preview = URL.createObjectURL(file);
            }

            return {
                id: fileId,
                name: file.name,
                type: fileType,
                size: fileSize,
                file: file,
                preview: preview
            };
        });

        setSelectedFiles(prev => [...prev, ...newSelectedFiles]);
    };

    const handleFileUpload = () => {
        if (selectedFiles.length === 0) return;

        setUploadingFiles(true);

        // Simulate upload delay for better UX
        setTimeout(() => {
            const filesToUpload = selectedFiles.map(file => ({
                ...file,
                uploadedAt: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
            }));

            setUploadedFiles(prev => [...prev, ...filesToUpload]);
            setSelectedFiles([]); // Clear selected files
            setUploadingFiles(false);
            setAttachmentsOpen(false); // Close modal after upload

            // Show success message using PrimeReact Messages
            messagesRef.current?.show([
                {
                    sticky: true,
                    life: 3000,
                    severity: 'success',
                    summary: 'Success',
                    detail: `${filesToUpload.length} file(s) uploaded successfully!`,
                    closable: true
                }
            ]);
        }, 1000);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelection(files);
        }
    };

    const handleViewFile = (file: any) => {
        // For PDFs, open in new tab
        if (file.type === 'pdf') {
            const url = URL.createObjectURL(file.file);
            window.open(url, '_blank');
            // Clean up the URL after a short delay to allow the browser to load it
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            return;
        }

        // For images, show in modal
        if (file.type === 'image') {
            setSelectedFile({
                name: file.name,
                preview: file.preview,
                type: file.type
            });
            setViewFileOpen(true);
        }
    };

    // Function to check if file is viewable
    const isFileViewable = (fileType: string) => {
        return fileType === 'pdf' || fileType === 'image';
    };

    const handleDeleteFile = (fileId: string) => {
        const fileToDelete = uploadedFiles.find(f => f.id === fileId);
        if (fileToDelete) {
            confirmDialog({
                message: `Are you sure you want to delete "${fileToDelete.name}"?`,
                header: 'Delete Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptClassName: 'p-button-danger',
                accept: () => {
                    setUploadedFiles(prev => {
                        if (fileToDelete.preview) {
                            URL.revokeObjectURL(fileToDelete.preview);
                        }
                        return prev.filter(f => f.id !== fileId);
                    });

                    // Show success message
                    messagesRef.current?.show([
                        {
                            sticky: true,
                            life: 3000,
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `File "${fileToDelete.name}" has been deleted successfully.`,
                            closable: true
                        }
                    ]);
                }
            });
        }
    };

    const handleDownloadFile = (file: any) => {
        const url = file.preview || URL.createObjectURL(file.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (!file.preview) {
            URL.revokeObjectURL(url);
        }

        // Show success message
        messagesRef.current?.show([
            {
                sticky: true,
                life: 3000,
                severity: 'success',
                summary: 'Downloaded',
                detail: `File "${file.name}" has been downloaded successfully.`,
                closable: true
            }
        ]);
    };

    const removeSelectedFile = (fileId: string) => {
        setSelectedFiles(prev => {
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter(f => f.id !== fileId);
        });
    };

    return (
        <>
            <style>{phoneInputStyles}</style>

            {/* Global Messages Component - Toast Style */}
            <Messages ref={messagesRef} className="fixed top-4 right-4 z-[9999] w-80" />

            {/* Global Confirm Dialog */}
            <ConfirmDialog />

            <div className="px-6 py-4 mx-auto">
                <div className='p-4 shadow-lg rounded-[8px] border border-[#AFAFAF] shadow-custom'>
                    {/* Top Status and Action Bar */}
                    <div className="bg-[#E3F8EC] rounded-lg shadow-custom p-4 grid grid-cols-12 gap-4 mb-6">
                        {/* 9-Column Feature Section */}
                        <div className="col-span-12 lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center gap-4">
                            {/* QR Code Preview */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setQrOpen(true)}>
                                <div className="w-14 h-14 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                    <div className="w-10 h-10 bg-black grid grid-cols-3 gap-0.5">
                                        {Array.from({ length: 9 }, (_, i) => (
                                            <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="font-[500] text-md text-primary bg-white inline-block p-1 mb-2">Order # {order.id}</div>
                                    <div className="text-[9px] text-[#5F5C5C]">Created date - 03/13/2025</div>
                                </div>
                            </div>

                            {/* Order Assignee */}
                            <div className="px-4 border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Order assigned</div>
                                <div className="flex items-center gap-2">
                                    {currentAssignedMember ? (
                                        <div className="flex items-center gap-2">
                                            {currentAssignedMember.avatar ? (
                                                <img
                                                    src={currentAssignedMember.avatar}
                                                    alt={currentAssignedMember.name}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                                                    {currentAssignedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs text-gray-600">{currentAssignedMember.name}</span>
                                            <Button
                                                icon={<XCircle className="text-red-500 w-3 h-3" />}
                                                className="p-1 m-0 rounded-full !bg-transparent !border-none"
                                                onClick={handleUnassignMember}
                                                style={{ width: 'auto', height: '0' }}
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">No one assigned</span>
                                    )}
                                    <Button
                                        icon={<CirclePlus className="text-green-500 w-4 h-4" />}
                                        className="p-1 m-0 rounded-full !bg-transparent !border-none"
                                        onClick={() => setAssignOpen(true)}
                                        style={{ width: 'auto', height: '0' }}
                                    />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="px-4 border-r border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Label</div>
                                <div className="flex items-center gap-1">
                                    {selectedLabel && (
                                        <span className={`text-sm px-2 py-1 rounded-[4px] ${selectedLabel.bgColor} ${selectedLabel.textColor}`}>
                                            {selectedLabel.name}
                                        </span>
                                    )}

                                    {/* Clickable Edit Icon without Button */}
                                    <div
                                        onClick={() => setLabelDialogOpen(true)}
                                        className="cursor-pointer p-1 rounded-full transition-all duration-200 hover:bg-gray-100 hover:scale-110 hover:text-green-600"
                                    >
                                        <PencilIcon className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Activity Timer */}
                            <div className="flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Activity Timer</div>
                                <div className="flex items-center gap-2">
                                    {/* Start/Stop Button */}
                                    <Button
                                        label={timerRunning ? "Stop" : "Start"}
                                        className={`p-button-sm !px-3 !py-0.5 text-sm ${timerRunning ? 'p-button-warning' : 'p-button-success'}`}
                                        onClick={handleTimerToggle}
                                        title={timerRunning ? "Click to stop and reset timer" : "Click to start timer"}
                                    />

                                    {/* Timer Display */}
                                    <span className="font-mono text-primary text-sm">{formatTime(timerSeconds)}</span>

                                    {/* Play/Pause Icon - Only show when timer is running */}
                                    {timerRunning && (
                                        <div
                                            onClick={handlePauseResume}
                                            className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
                                            role="button"
                                            tabIndex={0}
                                            title={isPaused ? "Click to resume timer" : "Click to pause timer"}
                                        >
                                            {isPaused ? (
                                                <Play className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Pause className="w-4 h-4 text-yellow-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ticket Card State */}
                            <div className="px-4 border-l border-[#d6d6d6] flex flex-col gap-3">
                                <div className="text-sm font-medium whitespace-nowrap text-[#5F5C5C]">Ticket State</div>
                                <div className="bg-white text-black text-md px-2 py-1 rounded-[4px] w-fit">{selectedStatus}</div>
                            </div>
                        </div>

                        {/* 3-Column Action Buttons */}
                        <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-end gap-2">
                            <Button
                                label="MARK COMPLETE"
                                className="p-button-success p-button-sm"
                                onClick={handleMarkComplete}
                            />
                            <Button
                                label="On Hold"
                                className="p-button-outlined p-button-sm"
                                onClick={handleOnHold}
                            />
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        <Button
                            label="Customer Info"
                            icon={<User className="w-4 h- me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setCustomerInfoOpen(true)}
                        />
                        <Button
                            label="Label"
                            icon={<Tag className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setLabelDialogOpen(true)}
                        />
                        <Button
                            label="Attachments"
                            icon={<Paperclip className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setAttachmentsOpen(true)}
                        />
                        <Button
                            label="Additional Order"
                            icon={<CirclePlus className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                            onClick={() => setAdditionalOrderOpen(true)}
                        />
                        <Button
                            label="Chat"
                            icon={<MessageCircle className="w-4 h-4 me-2" />}
                            className="p-button-outlined p-button-md"
                        />
                    </div>

                    {/* Main Content: Accordions */}
                    <div className="space-y-4">
                        {/* Left Column: Order Accordions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                {/* Custom Accordion for Order Details */}
                                <div className="bg-white rounded-lg border border-[#D1CCCC] shadow-custom">
                                    {/* Order Cost */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 hover:rounded-t-lg transition-colors ${activeIndex.includes(0) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(0)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 0));
                                                } else {
                                                    setActiveIndex([...activeIndex, 0]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Order cost</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(0) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(0) && (
                                            <div className="px-6 pt-4 pb-6 space-y-4">
                                                {/* Paid Toggle */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">

                                                        <div
                                                            className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${isPaid ? 'bg-green-500' : 'bg-gray-300'}`}
                                                            onClick={() => setIsPaid(!isPaid)}
                                                        >
                                                            <div
                                                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isPaid ? 'translate-x-6' : ''}`}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-700">Paid</span>
                                                    </div>
                                                </div>

                                                {/* Payment Method + Checkbox */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    {/* Radio Buttons */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <RadioButton
                                                                inputId="cash"
                                                                name="paymentMethod"
                                                                value="Cash"
                                                                checked={paymentMethod === 'Cash'}
                                                                onChange={(e) => setPaymentMethod(e.value)}
                                                            />
                                                            <label htmlFor="cash" className="text-sm text-[#414141] mb-0">Cash</label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RadioButton
                                                                inputId="online"
                                                                name="paymentMethod"
                                                                value="Online"
                                                                checked={paymentMethod === 'Online'}
                                                                onChange={(e) => setPaymentMethod(e.value)}
                                                            />
                                                            <label htmlFor="online" className="text-sm text-gray-700 mb-0">Online</label>
                                                        </div>
                                                    </div>

                                                    {/* Checkbox + Info */}
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            inputId="customerWillPay"
                                                            checked={customerWillPay}
                                                            onChange={(e) => setCustomerWillPay(Boolean(e.checked))}
                                                        />
                                                        <label htmlFor="customerWillPay" className="text-sm text-gray-700 mb-0">Customer will pay in store</label>
                                                        <span className="cursor-pointer">
                                                            <Info className="h-4 w-4 text-gray-500" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </div>

                                    {/* Order Info */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(1) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(1)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 1));
                                                } else {
                                                    setActiveIndex([...activeIndex, 1]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Order Info</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(1) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(1) && (
                                            <div className="px-6 pt-4 pb-6">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-gray-200">
                                                                <th className="text-left py-2 text-gray-700 font-medium">Service</th>
                                                                <th className="text-center py-2 text-gray-700 font-medium">Qty</th>
                                                                <th className="text-center py-2 text-gray-700 font-medium">Rate</th>
                                                                <th className="text-right py-2 text-gray-700 font-medium">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.serviceLog.map((item, idx) => (
                                                                <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                                                                    <td className="py-2 text-gray-700">{item.name}</td>
                                                                    <td className="py-2 text-center text-gray-500">{item.qty}</td>
                                                                    <td className="py-2 text-center text-gray-500">{item.rate}</td>
                                                                    <td className="py-2 text-right text-gray-700 font-medium">Kr {item.amount}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr className="border-t border-gray-200">
                                                                <td colSpan={3} className="py-2 pt-3 text-gray-900 font-semibold">Total</td>
                                                                <td className="py-2 pt-3 text-right text-gray-900 font-semibold">Kr {order.total}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>

                                        )}
                                    </div>

                                    {/* Order Description */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(2) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(2)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 2));
                                                } else {
                                                    setActiveIndex([...activeIndex, 2]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Description</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(2) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(2) && (
                                            <div className="px-6 pt-4 pb-6">
                                                {!isEditingDescription ? (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-700">{descriptionText}</span>
                                                        <Button
                                                            icon={<PencilIcon className="w-4 h-4" />}
                                                            className="p-button-text p-0 w-8 h-8"
                                                            onClick={() => setIsEditingDescription(true)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={descriptionText}
                                                            onChange={(e) => setDescriptionText(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            rows={3}
                                                            placeholder="Enter order description..."
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <Button
                                                                label="Cancel"
                                                                className="p-button-outlined !p-button-sm !px-4 h-8 w-full sm:w-auto !text-sm"
                                                                onClick={() => {
                                                                    setDescriptionText(order.description || '');
                                                                    setIsEditingDescription(false);
                                                                }}
                                                            />
                                                            <Button
                                                                label="Save"
                                                                className="p-button-primary !p-button-sm !px-4 h-8 w-full sm:w-auto !text-sm"
                                                                onClick={() => {
                                                                    // Here you would typically save to backend
                                                                    setIsEditingDescription(false);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Log */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 hover:rounded-b-lg transition-colors ${activeIndex.includes(3) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(3)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 3));
                                                } else {
                                                    setActiveIndex([...activeIndex, 3]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Order Log</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(3) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(3) && (
                                            <div className="px-6 pt-4 pb-6">
                                                <div className="max-h-64 overflow-y-auto divide-y divide-gray-200 pr-2">
                                                    {order.log.map((entry, idx) => (
                                                        <div key={idx} className="flex items-center justify-between py-2">
                                                            <span className="text-sm text-[#707070] truncate pr-4">{entry.text}</span>
                                                            <span className="text-xs text-gray-400 whitespace-nowrap">{entry.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Attachments, Comments, Requests Accordions */}
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg border border-[#D1CCCC] shadow-custom">
                                    {/* Attachments */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 hover:rounded-t-lg transition-colors ${activeIndex.includes(4) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(4)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 4));
                                                } else {
                                                    setActiveIndex([...activeIndex, 4]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Attachments</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(4) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(4) && (
                                            <div className="px-6 pt-4 pb-6">
                                                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                                                    {uploadedFiles.length > 0 ? (
                                                        uploadedFiles.map((file) => (
                                                            <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                        {file.type === 'pdf' ? (
                                                                            <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">PDF</span>
                                                                            </div>
                                                                        ) : file.type === 'image' ? (
                                                                            <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">IMG</span>
                                                                            </div>
                                                                        ) : file.type === 'excel' ? (
                                                                            <div className="w-6 h-6 bg-green-600 rounded-sm flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">XLS</span>
                                                                            </div>
                                                                        ) : file.type === 'word' ? (
                                                                            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">DOC</span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-6 h-6 bg-gray-500 rounded-sm flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">FILE</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900" title={file.name}>
                                                                            {truncateFileName(file.name, 35)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">{file.size} • {file.uploadedAt}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        className="!p-0 p-button-text p-button-sm text-blue-600 hover:text-blue-700 flex items-center justify-center"
                                                                        title="Download"
                                                                        onClick={() => handleDownloadFile(file)}
                                                                    >
                                                                        <Download size={16} />
                                                                    </Button>
                                                                    {isFileViewable(file.type) && (
                                                                        <Button
                                                                            className="!p-0 p-button-text p-button-sm text-green-600 hover:text-green-700 flex items-center justify-center"
                                                                            title={file.type === 'pdf' ? "Open in new tab" : "View"}
                                                                            onClick={() => handleViewFile(file)}
                                                                        >
                                                                            <Eye size={16} />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        className="!p-0 p-button-text p-button-sm text-red-600 hover:text-red-700 flex items-center justify-center"
                                                                        title="Delete"
                                                                        onClick={() => handleDeleteFile(file.id)}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <Paperclip className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                            <p className="text-sm">No attachments uploaded yet</p>
                                                            <p className="text-xs text-gray-400">Click the upload button to add files</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Comments */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${activeIndex.includes(5) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(5)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 5));
                                                } else {
                                                    setActiveIndex([...activeIndex, 5]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary">Comments</span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(5) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(5) && (
                                            <div className="px-6 pt-4 pb-6">
                                                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                                    {order.comments.map((comment, idx) => (
                                                        <div key={idx} className="bg-[#F5F5F5] px-4 pt-2 pb-4">
                                                            <div className="flex items-start gap-3">
                                                                {/* Profile Picture */}

                                                                {/* Content Area */}
                                                                <div className="flex-1 min-w-0">
                                                                    {/* Header with Name and Date */}
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                                                            </div>

                                                                            <div className="font-semibold text-sm text-[#414141]">
                                                                                {comment.user}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {comment.date}
                                                                        </div>
                                                                    </div>

                                                                    {/* Comment Text */}
                                                                    <div className="text-gray-700 text-sm leading-relaxed">
                                                                        {comment.text}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Requests */}
                                    <div className="border-b border-gray-200">
                                        <button
                                            className={`w-full px-6 py-3 text-left flex items-center justify-between hover:bg-gray-50 hover:rounded-b-lg transition-colors ${activeIndex.includes(6) ? '' : ''
                                                }`}
                                            onClick={() => {
                                                if (activeIndex.includes(6)) {
                                                    setActiveIndex(activeIndex.filter(i => i !== 6));
                                                } else {
                                                    setActiveIndex([...activeIndex, 6]);
                                                }
                                            }}
                                        >
                                            <span className="font-medium text-primary flex items-center gap-2">
                                                Requests
                                                <Badge value={order.requests} severity="danger" />
                                            </span>
                                            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeIndex.includes(6) ? 'rotate-90' : ''
                                                }`} />
                                        </button>
                                        {activeIndex.includes(6) && (
                                            <div className="px-6 pt-4 pb-6">
                                                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                                                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                        <div className="text-sm font-medium">Change pickup time</div>
                                                        <div className="text-xs text-gray-500">Customer requested earlier pickup</div>
                                                    </div>
                                                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                                        <div className="text-sm font-medium">Add service</div>
                                                        <div className="text-xs text-gray-500">Customer wants to add tire rotation</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Modal */}
                    <Dialog
                        header="Order QR Code"
                        visible={qrOpen}
                        onHide={() => setQrOpen(false)}
                        className="w-96"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="text-center space-y-4 pt-4">
                            <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                                <div className="w-48 h-48 bg-black grid grid-cols-5 gap-0.5">
                                    {Array.from({ length: 25 }, (_, i) => (
                                        <div key={i} className={`w-full h-full ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold">Order #{order.id}</div>
                                <div className="text-sm text-gray-500">Created: 03/13/2025 18:00:45</div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Assign User Modal */}
                    <Dialog
                        header="Members"
                        visible={assignOpen}
                        onHide={() => setAssignOpen(false)}
                        style={{ width: '500px' }}
                        modal
                        dismissableMask
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="space-y-4 pt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <InputText placeholder="Search members" className="w-full pl-10" />
                            </div>

                            <div>
                                <div className="font-medium text-sm mb-2">Board members</div>
                                <div className="space-y-2">
                                    {teamMembers
                                        .filter(member => member.status === 'active')
                                        .map((member) => (
                                            <div
                                                key={member.id}
                                                className={`flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer ${currentAssignedMember?.id === member.id ? 'bg-blue-50 border border-blue-200' : ''
                                                    }`}
                                                onClick={() => handleAssignMember(member.id)}
                                            >
                                                {member.avatar ? (
                                                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{member.name}</div>
                                                    <div className="text-xs text-gray-500">{member.role}</div>
                                                    {member.assignedOrders.length > 0 && (
                                                        <div className="text-xs text-blue-600">
                                                            {member.assignedOrders.length} order(s) assigned
                                                        </div>
                                                    )}
                                                </div>
                                                {currentAssignedMember?.id === member.id && (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Customer Info Modal */}
                    <Dialog
                        header="Update Order"
                        visible={customerInfoOpen}
                        onHide={() => setCustomerInfoOpen(false)}
                        className="w-[800px]"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        {/* View Mode - Show customer details */}
                        {!customerInfo.isEditing ? (
                            <div className="pt-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Reference Number</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.referenceNumber}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.fullName || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.email || 'Not specified'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.phoneNumber || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.address || 'Not specified'}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                                            <div className="text-sm text-gray-900">
                                                {customerInfo.notes || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Customer Type</label>
                                        <div className="text-sm text-gray-900">
                                            {customerInfo.customerType}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 justify-end">
                                    <div
                                        onClick={() => setCustomerInfo({ ...customerInfo, isEditing: true })}
                                        className="cursor-pointer w-12 h-12 bg-green-100 hover:scale-105 rounded-full flex items-center justify-center transition-colors"
                                        title="Edit Details"
                                    >
                                        <PencilIcon className="w-5 h-5 text-secondary" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Edit Mode - Form inputs */
                            <>
                                <div className="py-4">
                                    {/* Left Column */}
                                    <div className="space-y-4">

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Reference Number</label>
                                                <InputText value={customerInfo.referenceNumber} disabled className="w-full bg-gray-100" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Customer Name</label>
                                                <InputText
                                                    placeholder="Enter full name"
                                                    value={customerInfo.fullName}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Email</label>
                                                <InputText
                                                    placeholder="Enter email address"
                                                    value={customerInfo.email}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                                <PhoneInput
                                                    placeholder="Enter phone number"
                                                    value={customerInfo.phoneNumber}
                                                    onChange={(value) => setCustomerInfo({ ...customerInfo, phoneNumber: value || '' })}
                                                    className="w-full"
                                                    international
                                                    defaultCountry="US"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Address</label>
                                                <InputTextarea
                                                    placeholder="Enter address"
                                                    value={customerInfo.address}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Notes</label>
                                                <InputTextarea
                                                    placeholder="Enter notes"
                                                    value={customerInfo.notes}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Customer Type</label>
                                                <Dropdown
                                                    value={customerInfo.customerType}
                                                    options={[
                                                        { label: 'Regular', value: 'Regular' },
                                                        { label: 'VIP', value: 'VIP' },
                                                        { label: 'Premium', value: 'Premium' }
                                                    ]}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, customerType: e.value })}
                                                    className="w-full"
                                                    placeholder="Select customer type"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex gap-3 pt-6 justify-end">
                                    <Button label="Cancel" className="p-button-outlined px-6" onClick={() => setCustomerInfo({ ...customerInfo, isEditing: false })} />
                                    <Button label="Save" className="p-button-success px-6" />
                                </div>
                            </>
                        )}
                    </Dialog>

                    {/* Attachments Modal */}
                    <Dialog
                        header="File Upload"
                        visible={attachmentsOpen}
                        onHide={() => {
                            setAttachmentsOpen(false);
                            setSelectedFiles([]); // Clear selected files when modal is closed
                        }}
                        className="w-120"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="space-y-4 pt-4">
                            <div className='bg-[#F5F5F5] px-8 pt-6 pb-8 rounded-lg'>
                                <label className="font-medium text-sm mb-2">Upload File</label>
                                <div className="text-sm text-[#707070] mb-4">Add your files or document here</div>

                                <div
                                    className={`border-2 border-dashed ${isDragOver ? 'border-primary bg-primary/5' : uploadingFiles ? 'border-blue-400 bg-blue-50' : 'border-secondary bg-white'} rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer ${uploadingFiles ? 'cursor-not-allowed' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => !uploadingFiles && document.getElementById('fileInput')?.click()}
                                >
                                    {uploadingFiles ? (
                                        <>
                                            <Loader2 className="w-8 h-8 text-blue-600 mb-3 mx-auto animate-spin" />
                                            <div className="text-sm text-blue-700 font-medium mb-2">Uploading files...</div>
                                            <div className="text-xs text-blue-600">Please wait while we process your files</div>
                                        </>
                                    ) : (
                                        <>
                                            <FileUp className="w-8 h-8 text-[#95A5A6] mb-3 mx-auto" />
                                            <div className="text-xs text-[#707070]">
                                                Drop your files here, or <span className="text-secondary underline cursor-pointer">Click to browse</span>
                                            </div>
                                        </>
                                    )}

                                    <input
                                        id="fileInput"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                                        disabled={uploadingFiles}
                                    />
                                </div>
                                <div className="text-xs text-[#707070] flex items-center justify-between gap-1 mt-2">
                                    <div className='flex items-center gap-1'><Info className="w-4 h-4 text-[#95A5A6]" />
                                        Supported files docx, xlsx, png, webp, pdf</div>
                                    <div>
                                        Max size 10 KB
                                    </div>
                                </div>
                            </div>

                            {/* Selected Files Preview */}
                            {selectedFiles.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
                                    <div className="space-y-2">
                                        {selectedFiles.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                        {file.type === 'pdf' ? (
                                                            <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">PDF</span>
                                                            </div>
                                                        ) : file.type === 'image' ? (
                                                            <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">IMG</span>
                                                            </div>
                                                        ) : file.type === 'excel' ? (
                                                            <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">XLS</span>
                                                            </div>
                                                        ) : file.type === 'word' ? (
                                                            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">DOC</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 bg-gray-500 rounded-sm flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">FILE</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900" title={file.name}>
                                                            {truncateFileName(file.name, 30)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{file.size}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    icon="pi pi-trash"
                                                    className="p-button-text p-button-sm text-red-600 hover:text-red-700"
                                                    title="Remove"
                                                    onClick={() => removeSelectedFile(file.id)}
                                                ><Trash2 size={16} /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 justify-end">
                                <Button label="Cancel" className="p-button-outlined px-6" onClick={() => setAttachmentsOpen(false)} />
                                <Button
                                    label="Upload"
                                    className="p-button-success px-6"
                                    onClick={handleFileUpload}
                                    disabled={selectedFiles.length === 0 || uploadingFiles}
                                />
                            </div>
                        </div>
                    </Dialog>

                    {/* File View Modal */}
                    <Dialog
                        header={selectedFile?.name || "View File"}
                        visible={viewFileOpen}
                        onHide={() => setViewFileOpen(false)}
                        className="w-4/5 max-w-4xl"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="pt-4">
                            {selectedFile?.type === 'image' && selectedFile?.preview ? (
                                <div className="text-center">
                                    <img
                                        src={selectedFile.preview}
                                        alt={selectedFile.name}
                                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        {selectedFile?.type === 'pdf' ? (
                                            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-lg font-bold">PDF</span>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-lg font-bold">DOC</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-2">{selectedFile?.name}</p>
                                    <p className="text-sm text-gray-500">Preview not available for this file type</p>
                                    <Button
                                        label="Download"
                                        icon="pi pi-download"
                                        className="p-button-primary mt-4"
                                        onClick={() => {
                                            if (selectedFile) {
                                                const foundFile = uploadedFiles.find(f => f.name === selectedFile.name);
                                                if (foundFile) {
                                                    handleDownloadFile(foundFile);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Dialog>

                    {/* Additional Order Modal */}
                    <Dialog
                        header="Additional Order"
                        visible={additionalOrderOpen}
                        onHide={() => setAdditionalOrderOpen(false)}
                        className="w-96"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <InputText
                                    placeholder="Enter order title"
                                    value={additionalOrder.title}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, title: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <InputText
                                    placeholder="Enter price"
                                    value={additionalOrder.price}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, price: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <InputText
                                    placeholder="Enter description"
                                    value={additionalOrder.description}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, description: e.target.value })}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    inputId="additionalCustomerWillPay"
                                    checked={additionalOrder.customerWillPay || false}
                                    onChange={(e) => setAdditionalOrder({ ...additionalOrder, customerWillPay: e.checked || false })}
                                />
                                <label htmlFor="additionalCustomerWillPay" className="text-sm mb-0">Customer will pay in store</label>
                            </div>

                            <div className="flex gap-3 pt-4 justify-end">
                                <Button label="Cancel" className="p-button-outlined px-6" onClick={() => setAdditionalOrderOpen(false)} />
                                <Button label="Save" className="p-button-success px-6" />
                            </div>
                        </div>
                    </Dialog>

                    {/* Label Management Dialog */}
                    <Dialog
                        header="Manage Labels"
                        visible={labelDialogOpen}
                        onHide={() => setLabelDialogOpen(false)}
                        className="w-96"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="space-y-4 pt-4">
                            <div className="font-medium text-sm mb-2">Predefined Labels</div>
                            <div className="grid grid-cols-2 gap-2">
                                {predefinedLabels.map((label) => (
                                    <div
                                        key={label.id}
                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${selectedLabel?.id === label.id ? 'bg-blue-50 border border-blue-200' : ''
                                            }`}
                                        onClick={() => handleLabelSelect(label)}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${label.bgColor}`}>
                                            <label.icon className={`w-3 h-3 ${label.textColor}`} />
                                        </div>
                                        <span className={`text-sm ${label.textColor}`}>{label.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">Custom Labels</span>
                                    <Button icon={<Plus className="w-4 h-4" />} className="p-button-text p-button-sm" onClick={() => setCustomLabelDialogOpen(true)} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {customLabels.map((label) => (
                                        <div key={label.id} className="flex items-center gap-2">
                                            <span
                                                className="text-sm px-3 py-1 rounded-full text-white"
                                                style={{ backgroundColor: label.color }}
                                            >
                                                {label.name}
                                            </span>
                                            <Button
                                                icon={<Trash2 className="w-4 h-4 text-red-500" />}
                                                className="p-button-text p-0 w-8 h-8"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCustomLabel(label.id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    {/* Custom Label Creation Dialog */}
                    <Dialog
                        header="Create Custom Label"
                        visible={customLabelDialogOpen}
                        onHide={() => setCustomLabelDialogOpen(false)}
                        className="w-96"
                        headerClassName="!bg-primary !py-4 !px-6 !text-white !text-normal border-b-0"
                        closeIcon={<CircleX className="w-5 h-5 text-white" />}
                        closeOnEscape
                    >
                        <div className="space-y-4 py-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-gray-700">Label Name</label>
                                <input
                                    type="text"
                                    value={customLabelName}
                                    onChange={(e) => setCustomLabelName(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm"
                                    placeholder="Enter label name"
                                />

                                <label className="text-sm font-medium text-gray-700 mt-2">Pick a Color</label>
                                <ChromePicker
                                    color={customLabelColor}
                                    onChange={(color) => setCustomLabelColor(color.hex)}
                                    disableAlpha
                                />

                            </div>


                            <div className="flex gap-3 justify-end">
                                <Button
                                    label="Cancel"
                                    className="p-button-outlined px-6"
                                    onClick={() => setCustomLabelDialogOpen(false)}
                                />
                                <Button
                                    label="Create Label"
                                    className="p-button-success px-6"
                                    onClick={handleCreateCustomLabel}
                                    disabled={!customLabelName.trim()}
                                />
                            </div>
                        </div>
                    </Dialog>

                    {/* File Menu */}
                    <Menu model={fileMenuItems} popup ref={menuRef} />
                </div>
            </div>
        </>
    );
} 