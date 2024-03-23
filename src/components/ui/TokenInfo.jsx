import { Title } from './ui'
import { useToken } from 'wagmi'
import PropTypes from 'prop-types'

function TokenInfoItem({ label, value }) {
  return (
    <li className="flex gap-2 bg-gray-100 text-zinc-600 p-2 rounded-md text-sm">
      <span className="font-bold capitalize">{label}:</span>
      <p>{value}</p>
    </li>
  )
}

TokenInfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default function TokenInfo() {
  const { data } = useToken({
    address: '0xD0B8FE0aC1040257d4e18BBA6eEF3848EfaD7D87',
    watch: true
  })

  return (
    <div className="bg-white p-4 border shadow rounded-md">
      <Title>Token Info</Title>
      <ul className="grid gap-4">
        <TokenInfoItem label="name" value={data?.name} />
        <TokenInfoItem label="symbol" value={data?.symbol} />
        <TokenInfoItem label="decimals" value={data?.decimals} />
        <TokenInfoItem label="total supply" value={data?.totalSupply.formatted} />
        <TokenInfoItem label="address" value={data?.address} />
      </ul>
    </div>
  )
}