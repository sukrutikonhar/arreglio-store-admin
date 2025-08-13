import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function FinancialSettings() {
    const navigate = useNavigate();
    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="field">
                    <label htmlFor="companyName" className="block mb-2">Company Name</label>
                    <InputText id="companyName" className="w-full" placeholder="Enter company name" />
                </div>
                <div className="field">
                    <label htmlFor="organizationNumber" className="block mb-2">Organization Number</label>
                    <InputText id="organizationNumber" className="w-full" placeholder="Enter organization number" />
                </div>
                <div className="field">
                    <label htmlFor="taxNumber" className="block mb-2">Tax Number</label>
                    <InputText id="taxNumber" className="w-full" placeholder="Enter tax number" />
                </div>
                <div className="field">
                    <label htmlFor="businessRegistration" className="block mb-2">Business Registration Number</label>
                    <InputText id="businessRegistration" className="w-full" placeholder="Enter registration number" />
                </div>
                <div className="field">
                    <label htmlFor="accountHolder" className="block mb-2">Business/Account Holder Name</label>
                    <InputText id="accountHolder" className="w-full" placeholder="Enter account holder name" />
                </div>
                <div className="field">
                    <label htmlFor="clearingNumber" className="block mb-2">Clearing Number</label>
                    <InputText id="clearingNumber" className="w-full" placeholder="Enter clearing number" />
                </div>
                <div className="field">
                    <label htmlFor="accountNumber" className="block mb-2">Account Number</label>
                    <InputText id="accountNumber" className="w-full" placeholder="Enter account number" />
                </div>
                <div className="field">
                    <label htmlFor="iban" className="block mb-2">IBAN Number</label>
                    <InputText id="iban" className="w-full" placeholder="Enter IBAN number" />
                </div>
                <div className="field">
                    <label htmlFor="bic" className="block mb-2">BIC/SWIFT Code</label>
                    <InputText id="bic" className="w-full" placeholder="Enter BIC/SWIFT code" />
                </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-12 flex !space-x-3">
                <Button label="Cancel" className="btn btn-outline" onClick={() => navigate('/settings/general')} outlined />
                <Button label="Next" className="btn btn-primary" onClick={() => navigate('/dashboard')} />
            </div>
        </div>
    );
}
