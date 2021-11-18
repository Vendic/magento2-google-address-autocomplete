<?php declare(strict_types=1);

namespace Vendic\GoogleAutocomplete\Model\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Settings
{
    public const GOOGLE_AUTOCOMPLETE_API_KEY_XML_PATH = 'google_autocomplete/general/api_key';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig
    ) {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @return string
     */
    public function getApiKey(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::GOOGLE_AUTOCOMPLETE_API_KEY_XML_PATH,
            ScopeInterface::SCOPE_STORE
        );
    }
}
