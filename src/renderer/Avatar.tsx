import React, { useRef } from 'react';
import { Player } from '../common/AmongUsState';
import { getCosmetic, redAlive, cosmeticType, getHatDementions, HatDementions } from './cosmetics';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MicOff from '@material-ui/icons/MicOff';
import VolumeOff from '@material-ui/icons/VolumeOff';
import WifiOff from '@material-ui/icons/WifiOff';
import LinkOff from '@material-ui/icons/LinkOff';
import ErrorOutline from '@material-ui/icons/ErrorOutline'; //@ts-ignore
import RadioSVG from '../../static/radio.svg';
// import Tooltip from '@material-ui/core/Tooltip';
import Tooltip from 'react-tooltip-lite';
import { SocketConfig } from '../common/ISettings';
import Slider from '@material-ui/core/Slider';
import VolumeUp from '@material-ui/icons/VolumeUp';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { ModsType } from '../common/Mods';

const useStyles = makeStyles(() => ({
	canvas: {
		position: 'absolute',
		width: '100%',
	},
	icon: {
		background: '#ea3c2a',
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		border: '2px solid #690a00',
		borderRadius: '50%',
		padding: 2,
		zIndex: 10,
	},
	iconNoBackground: {
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		borderRadius: '50%',
		padding: 2,
		zIndex: 10,
	},
	relative: {
		position: 'relative',
	},
	slidecontainer: {
		minWidth: '80px',
	},
	innerTooltip: {
		textAlign: 'center',
	},
}));

export interface CanvasProps {
	hat: number;
	skin: number;
	isAlive: boolean;
	className: string;
	lookLeft: boolean;
	size: number;
	borderColor: string;
	color: number;
	overflow: boolean;
	usingRadio: boolean | undefined;
	onClick?: () => void;
	mod: ModsType;
}

export interface AvatarProps {
	talking: boolean;
	borderColor: string;
	isAlive: boolean;
	player: Player;
	size: number;
	deafened?: boolean;
	muted?: boolean;
	connectionState?: 'disconnected' | 'novoice' | 'connected';
	socketConfig?: SocketConfig;
	showborder?: boolean;
	showHat?: boolean;
	lookLeft?: boolean;
	overflow?: boolean;
	isUsingRadio?: boolean;
	onConfigChange?: () => void;
	mod: ModsType;
}

const Avatar: React.FC<AvatarProps> = function ({
	talking,
	deafened,
	muted,
	borderColor,
	isAlive,
	player,
	size,
	connectionState,
	socketConfig,
	showborder,
	showHat,
	isUsingRadio,
	lookLeft = false,
	overflow = false,
	onConfigChange,
	mod,
}: AvatarProps) {
	const classes = useStyles();
	let icon;
	deafened = deafened === true || socketConfig?.isMuted === true || socketConfig?.volume === 0;
	switch (connectionState) {
		case 'connected':
			if (deafened) {
				icon = <VolumeOff className={classes.icon} />;
			} else if (muted) {
				icon = <MicOff className={classes.icon} />;
			}
			break;
		case 'novoice':
			icon = <LinkOff className={classes.icon} style={{ background: '#e67e22', borderColor: '#694900' }} />;
			break;
		case 'disconnected':
			icon = <WifiOff className={classes.icon} />;
			break;
	}
	if (player.bugged) {
		icon = <ErrorOutline className={classes.icon} style={{ background: 'red', borderColor: '' }} />;
	}
	const canvas = (
		<Canvas
			className={classes.canvas}
			color={player.colorId}
			hat={showHat === false ? -1 : player.hatId}
			skin={player.skinId - 1}
			isAlive={isAlive}
			lookLeft={lookLeft === true}
			borderColor={talking ? borderColor : showborder === true ? '#ccbdcc86' : 'transparent'}
			size={size}
			overflow={overflow}
			usingRadio={isUsingRadio}
			mod={mod}
		/>
	);

	if (socketConfig) {
		let muteButtonIcon;
		if (socketConfig.isMuted) {
			muteButtonIcon = <VolumeOff color="primary" className={classes.iconNoBackground}></VolumeOff>;
		} else {
			muteButtonIcon = <VolumeUp color="primary" className={classes.iconNoBackground}></VolumeUp>;
		}
		return (
			<Tooltip
				mouseOutDelay={300}
				content={
					<div className={classes.innerTooltip}>
						<b>{player.name}</b>
						<Grid container spacing={0} className={classes.slidecontainer}>
							<Grid item>
								<IconButton
									onClick={() => {
										socketConfig.isMuted = !socketConfig.isMuted;
									}}
									style={{ margin: '1px 1px 0px 0px' }}
								>
									{muteButtonIcon}
								</IconButton>
							</Grid>
							<Grid item xs>
								<Slider
									value={socketConfig.volume}
									min={0}
									max={2}
									step={0.02}
									onChange={(_, newValue: number | number[]) => {
										socketConfig.volume = newValue as number;
									}}
									valueLabelDisplay={'auto'}
									valueLabelFormat={(value) => Math.floor(value * 100) + '%'}
									onMouseLeave={() => {
										if (onConfigChange) {
											onConfigChange();
										}
									}}
									aria-labelledby="continuous-slider"
								/>
							</Grid>
						</Grid>
					</div>
				}
				padding={5}
			>
				{canvas}
				{icon}
			</Tooltip>
		);
	} else {
		return (
			<div className={classes.relative}>
				{canvas}
				{icon}
			</div>
		);
	}
};

interface UseCanvasStylesParams {
	isAlive: boolean;
	hatDementions: HatDementions;
	lookLeft: boolean;
	size: number;
	borderColor: string;
	paddingLeft: number;
}
const useCanvasStyles = makeStyles(() => ({
	base: {
		width: '105%',
		position: 'absolute',
		top: '22%',
		left: ({ paddingLeft }: UseCanvasStylesParams) => paddingLeft,
		zIndex: 2,
	},
	hat: {
		pointerEvents: 'none',
		width: ({ hatDementions }: UseCanvasStylesParams) => hatDementions.width,
		position: 'absolute',
		top: ({ hatDementions }: UseCanvasStylesParams) => `calc(22% + ${hatDementions.top})`,
		left: ({ size, paddingLeft, hatDementions }: UseCanvasStylesParams) =>
			`calc(${hatDementions.left} + ${Math.max(2, size / 40) / 2 + paddingLeft}px)`, //`calc(${hatDementions.left} + ${Math.max(2, size / 40) / 2 + paddingLeft})` ,
		zIndex: 4,
		display: ({ isAlive }: UseCanvasStylesParams) => (isAlive ? 'block' : 'none'),
	},
	skin: {
		pointerEvents: 'none',
		position: 'absolute',
		top: 'calc(33% + 22%)',
		left: ({ paddingLeft }: UseCanvasStylesParams) => paddingLeft,
		width: '105%',
		zIndex: 3,
		display: ({ isAlive }: UseCanvasStylesParams) => (isAlive ? 'block' : 'none'),
	},
	avatar: {
		// overflow: 'hidden',
		borderRadius: '50%',
		position: 'relative',
		borderStyle: 'solid',
		transition: 'border-color .2s ease-out',
		borderColor: ({ borderColor }: UseCanvasStylesParams) => borderColor,
		borderWidth: ({ size }: UseCanvasStylesParams) => Math.max(2, size / 40),
		transform: ({ lookLeft }: UseCanvasStylesParams) => (lookLeft ? 'scaleX(-1)' : 'scaleX(1)'),
		width: '100%',
		paddingBottom: '100%',
		cursor: 'pointer',
	},
	radio: {
		position: 'absolute',
		left: '70%',
		top: '80%',
		width: '30px',
		transform: 'translate(-50%, -50%)',
		fill: 'white',
		padding: 2,
		zIndex: 12,
	},
}));

function Canvas({
	hat,
	skin,
	isAlive,
	lookLeft,
	size,
	borderColor,
	color,
	overflow,
	usingRadio,
	onClick,
	mod,
}: CanvasProps) {
	const hatImg = useRef<HTMLImageElement>(null);
	const skinImg = useRef<HTMLImageElement>(null);
	const image = useRef<HTMLImageElement>(null);
	const hatDementions = getHatDementions(hat, mod);
	const classes = useCanvasStyles({
		isAlive,
		hatDementions: hatDementions,
		lookLeft,
		size,
		borderColor,
		paddingLeft: -7,
	});

	//@ts-ignore
	const onerror = (e: any) => {
		e.target.style.display = 'none';
	};

	//@ts-ignore
	const onload = (e: any) => {
		e.target.style.display = '';
	};

	const hatElement = (
		<>
			<img
				src={getCosmetic(color, isAlive, cosmeticType.hat, hat, mod)}
				ref={hatImg}
				className={classes.hat}
				onError={onerror}
				onLoad={onload}
			/>
			<img
				src={getCosmetic(color, isAlive, cosmeticType.hat_back, hat, mod)}
				ref={hatImg}
				className={classes.hat}
				style={{ zIndex: 1 }}
				onError={onerror}
				onLoad={onload}
			/>
		</>
	);
	
	return (
		<>
			<div className={classes.avatar} onClick={onClick}>
				<div
					className={classes.avatar}
					style={{
						overflow: 'hidden',
						position: 'absolute',
						top: Math.max(2, size / 40) * -1,
						left: Math.max(2, size / 40) * -1,
						transform: 'unset',
					}}
				>
					<img
						src={getCosmetic(color, isAlive, cosmeticType.base)}
						ref={image}
						className={classes.base}
						//@ts-ignore
						onError={(e: any) => {
							e.target.onError = null;
							e.target.src = redAlive;
						}}
					/>

					<img
						src={getCosmetic(color, isAlive, cosmeticType.skin, skin, mod)}
						style={{ top: skin === 17 ? '0%' : undefined }}
						ref={skinImg}
						className={classes.skin}
						onError={onerror}
						onLoad={onload}
					/>

					{overflow && hatElement}
				</div>
				{!overflow && hatElement}
				{usingRadio && <img src={RadioSVG} className={classes.radio} />}
			</div>
		</>
	);
}

export default Avatar;
