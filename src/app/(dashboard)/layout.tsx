interface DasboardLayoutProps {
    children: React.ReactNode;
}

const DasboardLayout = ( { children }: DasboardLayoutProps ) => {
    return (
        <div className="min-h-screen">
            <div className="flex w-full h-full">
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
 };

export default DasboardLayout;