import React from 'react';
import { render } from '@testing-library/react'
import { useExtraneousFont, UniqueFontObject } from './index';

describe('useExtraneousFont suite', () => {
    test('happy path one - fontUrlObj provided is of type UniqueFontObject', async () => {
        const FontMountingComponent = () => {
            const fontState = useExtraneousFont({
                fontUrl: '#',
                key: 'poppins'
            });

            if (fontState.loading) {
                return <p data-testid="loading">loading</p>;
            }

            if (fontState.failed) {
                return (
                  <span data-testid="error" style={{color:'red'}}>
                    An error occurred mounting the link to the dom.
                  </span>
                );
            }

            return (
                <div data-testid="final-markup">
                    <h6 style={{ fontFamily: 'Poppins, Regular' }}>
                        Asynchronous Font Appendage
                    </h6>
                </div>
            );
        }
        const WrappingComponent = ({ children }: { children: React.ReactNode }) => (
            <html>
                <head></head>
                <body>
                    {children}
                </body>
            </html>
        );
        const { queryByTestId } = render(
            <WrappingComponent>
                <FontMountingComponent />
            </WrappingComponent>
        );

        /** 
         * Suspend thread so the internal hooks in FontMountingComponent
         * can fire asynchronously after mounting
         * */
        await new Promise((res, _rej)  => setTimeout(res, 3000));

        const finalMarkupDiv = queryByTestId('final-markup');
        expect(finalMarkupDiv).not.toBeNull();
        expect(finalMarkupDiv).toBeInTheDocument();
    })
});