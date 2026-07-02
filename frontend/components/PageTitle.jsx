export default function PageTitle({ title, subtitle }) {
    return (
        <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-300">{title}</h1>
            {subtitle && <p className="text-lg text-gray-500 mt-2">{subtitle}</p>}
        </div>
    )
}